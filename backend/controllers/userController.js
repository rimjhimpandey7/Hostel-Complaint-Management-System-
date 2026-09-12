const bcrypt = require('bcryptjs');
const db = require('../config/db');

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, student_id, room_number, hostel_block, role, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current logged in user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, room_number, hostel_block } = req.body;

    if (email) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase().trim(), req.user.id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another user.' });
      }
    }

    const result = await db.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           room_number = COALESCE($4, room_number),
           hostel_block = COALESCE($5, hostel_block),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, email, phone, student_id, room_number, hostel_block, role, updated_at`,
      [name, email ? email.toLowerCase().trim() : null, phone, room_number, hostel_block, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change User Password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current password, new password, and confirm password.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirm password do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    // Get current user password
    const userRes = await db.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, req.user.id]);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
