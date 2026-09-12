const db = require('../config/db');
const { sendEmail, emailTemplates } = require('../config/email');

/**
 * @desc    Get all complaints (Admin View)
 * @route   GET /api/admin/complaints
 * @access  Private (Admin)
 */
const getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, search } = req.query;

    let queryText = `
      SELECT c.*, u.name as student_name, u.email as student_email, u.phone as student_phone, u.student_id, u.hostel_block
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

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
      queryText += ` AND (c.title ILIKE $${paramIndex} OR c.complaint_id ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex} OR c.room_number ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY c.created_at DESC`;

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      message: 'All complaints retrieved successfully.',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint status & remarks
 * @route   PUT /api/admin/complaints/:id/status
 * @access  Private (Admin)
 */
const updateStatus = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { status, remarks } = req.body;

    const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Get current complaint and student email
    const complaintRes = await db.query(
      `SELECT c.*, u.name as student_name, u.email as student_email 
       FROM complaints c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [complaintId]
    );

    if (complaintRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const complaint = complaintRes.rows[0];
    const isResolved = status === 'Resolved';
    const resolvedAt = isResolved ? new Date() : (status === 'Pending' ? null : complaint.resolved_at);

    // Update complaint record
    const updateRes = await db.query(
      `UPDATE complaints
       SET status = $1,
           admin_remarks = COALESCE($2, admin_remarks),
           resolved_at = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [status, remarks, resolvedAt, complaintId]
    );

    const updatedComplaint = updateRes.rows[0];

    // Log timeline update
    await db.query(
      `INSERT INTO complaint_updates (complaint_id, status, remarks, updated_by) VALUES ($1, $2, $3, $4)`,
      [complaintId, status, remarks || `Status changed to ${status}`, req.user.id]
    );

    // Dispatch email notification to student
    const mailContent = emailTemplates.complaintStatusUpdate(
      complaint.student_name,
      complaint.complaint_id,
      complaint.title,
      status,
      remarks,
      complaint.assigned_to
    );
    sendEmail({ to: complaint.student_email, ...mailContent });

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to '${status}'.`,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign complaint to staff / department
 * @route   PUT /api/admin/complaints/:id/assign
 * @access  Private (Admin)
 */
const assignComplaint = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { assigned_to, remarks } = req.body;

    if (!assigned_to) {
      return res.status(400).json({ success: false, message: 'Please specify assigned staff member or department.' });
    }

    const complaintRes = await db.query(
      `SELECT c.*, u.name as student_name, u.email as student_email 
       FROM complaints c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [complaintId]
    );

    if (complaintRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const complaint = complaintRes.rows[0];
    const newStatus = complaint.status === 'Pending' ? 'Assigned' : complaint.status;

    // Update assignment
    const updateRes = await db.query(
      `UPDATE complaints
       SET assigned_to = $1,
           status = $2,
           admin_remarks = COALESCE($3, admin_remarks),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [assigned_to.trim(), newStatus, remarks, complaintId]
    );

    // Log timeline
    await db.query(
      `INSERT INTO complaint_updates (complaint_id, status, remarks, updated_by) VALUES ($1, $2, $3, $4)`,
      [complaintId, newStatus, `Assigned to ${assigned_to}. ${remarks || ''}`, req.user.id]
    );

    // Email notification
    const mailContent = emailTemplates.complaintStatusUpdate(
      complaint.student_name,
      complaint.complaint_id,
      complaint.title,
      newStatus,
      `Ticket assigned to staff/department: ${assigned_to}. ${remarks || ''}`,
      assigned_to
    );
    sendEmail({ to: complaint.student_email, ...mailContent });

    return res.status(200).json({
      success: true,
      message: `Complaint assigned to '${assigned_to}' successfully.`,
      data: updateRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete inappropriate complaint
 * @route   DELETE /api/admin/complaints/:id
 * @access  Private (Admin)
 */
const deleteComplaint = async (req, res, next) => {
  try {
    const complaintId = req.params.id;

    const checkRes = await db.query('SELECT complaint_id FROM complaints WHERE id = $1', [complaintId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found.' });
    }

    await db.query('DELETE FROM complaints WHERE id = $1', [complaintId]);

    return res.status(200).json({
      success: true,
      message: `Complaint ${checkRes.rows[0].complaint_id} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of all registered students
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
const getStudents = async (req, res, next) => {
  try {
    const { search } = req.query;

    let queryText = `
      SELECT id, name, email, phone, student_id, room_number, hostel_block, created_at,
             (SELECT COUNT(*) FROM complaints WHERE user_id = users.id) as total_complaints
      FROM users
      WHERE role = 'student'
    `;

    const queryParams = [];
    if (search) {
      queryText += ` AND (name ILIKE $1 OR email ILIKE $1 OR student_id ILIKE $1 OR room_number ILIKE $1 OR hostel_block ILIKE $1)`;
      queryParams.push(`%${search}%`);
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      message: 'Students retrieved successfully.',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student account
 * @route   DELETE /api/admin/students/:id
 * @access  Private (Admin)
 */
const deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    const checkRes = await db.query("SELECT name FROM users WHERE id = $1 AND role = 'student'", [studentId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [studentId]);

    return res.status(200).json({
      success: true,
      message: `Student account '${checkRes.rows[0].name}' and associated complaints removed.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Analytics Dashboard Data for Recharts
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Overall Stats Counters
    const statsRes = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM complaints) as total_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'Pending') as pending_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'In Progress') as in_progress_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'Assigned') as assigned_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'Resolved') as resolved_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'Rejected') as rejected_complaints,
        (SELECT COUNT(*) FROM complaints WHERE priority = 'Emergency') as emergency_complaints
    `);

    // 2. Chart 1: Complaints by Category
    const categoryRes = await db.query(`
      SELECT category, COUNT(*)::int as count 
      FROM complaints 
      GROUP BY category 
      ORDER BY count DESC
    `);

    // 3. Chart 2: Complaints by Status
    const statusRes = await db.query(`
      SELECT status, COUNT(*)::int as count 
      FROM complaints 
      GROUP BY status
    `);

    // 4. Chart 3: Complaints by Priority
    const priorityRes = await db.query(`
      SELECT priority, COUNT(*)::int as count 
      FROM complaints 
      GROUP BY priority
    `);

    // 5. Chart 4: Complaints Over Time (Last 7 Days)
    const timeTrendRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*)::int as count
      FROM complaints
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC
    `);

    return res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully.',
      data: {
        counters: statsRes.rows[0],
        byCategory: categoryRes.rows,
        byStatus: statusRes.rows,
        byPriority: priorityRes.rows,
        overTime: timeTrendRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllComplaints,
  updateStatus,
  assignComplaint,
  deleteComplaint,
  getStudents,
  deleteStudent,
  getAnalytics,
};
