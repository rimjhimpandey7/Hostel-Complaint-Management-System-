const db = require('../config/db');
const { generateComplaintId } = require('../utils/helpers');
const { sendEmail, emailTemplates } = require('../config/email');

/**
 * @desc    Submit a new complaint
 * @route   POST /api/complaints
 * @access  Private (Student)
 */
const createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, room_number, priority } = req.body;
    const userId = req.user.id;

    if (!title || !category || !description || !room_number || !priority) {
      return res.status(400).json({ success: false, message: 'All complaint details (title, category, description, room_number, priority) are required.' });
    }

    const complaintId = generateComplaintId();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Fetch user details for notification
    const userRes = await db.query('SELECT name, email, hostel_block FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    // Insert complaint record
    const insertQuery = `
      INSERT INTO complaints (complaint_id, user_id, title, category, description, room_number, priority, status, image, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', $8, NOW())
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      complaintId,
      userId,
      title.trim(),
      category.trim(),
      description.trim(),
      room_number.trim(),
      priority.trim(),
      imagePath,
    ]);

    const newComplaint = result.rows[0];

    // Create initial timeline update record
    await db.query(
      `INSERT INTO complaint_updates (complaint_id, status, remarks, updated_by) VALUES ($1, $2, $3, $4)`,
      [newComplaint.id, 'Pending', 'Complaint ticket submitted online by student.', userId]
    );

    // Send Async Email Confirmations
    const studentMail = emailTemplates.complaintSubmittedStudent(user.name, complaintId, title, category, priority);
    sendEmail({ to: user.email, ...studentMail });

    // Send Admin Notification Email
    const adminRes = await db.query("SELECT email FROM users WHERE role = 'admin'");
    if (adminRes.rows.length > 0) {
      const adminMail = emailTemplates.complaintSubmittedAdminAlert(
        complaintId,
        title,
        category,
        priority,
        room_number,
        user.name
      );
      adminRes.rows.forEach(adminRow => {
        sendEmail({ to: adminRow.email, ...adminMail });
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: newComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints submitted by logged-in student
 * @route   GET /api/complaints/my
 * @access  Private (Student)
 */
const getMyComplaints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, status, priority, search } = req.query;

    let queryText = `
      SELECT c.*, u.name as student_name, u.email as student_email
      SELECT c.id, c.complaint_id, c.title, c.category, c.description, c.room_number, c.priority, c.status, c.image, c.assigned_to, c.admin_remarks, c.created_at, c.updated_at, c.resolved_at
      FROM complaints c
      WHERE c.user_id = $1
    `;

    const queryParams = [userId];
    let paramIndex = 2;

    if (category) {
      queryText += ` AND c.category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND c.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (priority) {
      queryText += ` AND c.priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (c.title ILIKE $${paramIndex} OR c.complaint_id ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY c.created_at DESC`;

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      message: 'Complaints fetched successfully.',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaint details by ID (with timeline updates)
 * @route   GET /api/complaints/:id
 * @access  Private (Student & Admin)
 */
const getComplaintById = async (req, res, next) => {
  try {
    const complaintId = req.params.id;

    // Fetch complaint record with student details
    const complaintRes = await db.query(
      `SELECT c.*, u.name as student_name, u.email as student_email, u.phone as student_phone, u.student_id, u.hostel_block
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1 OR c.complaint_id = $1`,
      [complaintId]
    );

    if (complaintRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const complaint = complaintRes.rows[0];

    // Authorization Check: Student can only view their own complaint unless Admin
    if (req.user.role === 'student' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this complaint ticket.' });
    }

    // Fetch timeline updates
    const updatesRes = await db.query(
      `SELECT cu.*, u.name as updater_name, u.role as updater_role
       FROM complaint_updates cu
       LEFT JOIN users u ON cu.updated_by = u.id
       WHERE cu.complaint_id = $1
       ORDER BY cu.created_at ASC`,
      [complaint.id]
    );

    complaint.timeline = updatesRes.rows;

    return res.status(200).json({
      success: true,
      message: 'Complaint details fetched successfully.',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint details (Student editing pending complaint)
 * @route   PUT /api/complaints/:id
 * @access  Private (Student)
 */
const updateComplaint = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { title, description, priority, category } = req.body;

    const checkRes = await db.query('SELECT * FROM complaints WHERE id = $1 AND user_id = $2', [complaintId, req.user.id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found or not owned by user.' });
    }

    if (checkRes.rows[0].status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Cannot modify complaint once processing has commenced.' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : checkRes.rows[0].image;

    const result = await db.query(
      `UPDATE complaints
       SET title = COALESCE($1, title),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           priority = COALESCE($4, priority),
           image = COALESCE($5, image),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, category, description, priority, imagePath, complaintId]
    );

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
};
