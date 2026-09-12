const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendEmail, emailTemplates } = require('../config/email');
const { generateResetToken } = require('../utils/helpers');

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, student_id, room_number, hostel_block, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !student_id || !room_number || !hostel_block || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required registration fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check if user or student_id exists
    const userCheck = await db.query(
      'SELECT id FROM users WHERE email = $1 OR student_id = $2',
      [email.toLowerCase().trim(), student_id.trim()]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this Email or Student ID already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    const result = await db.query(
      `INSERT INTO users (name, email, phone, student_id, room_number, hostel_block, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'student')
       RETURNING id, name, email, phone, student_id, room_number, hostel_block, role, created_at`,
      [name.trim(), email.toLowerCase().trim(), phone.trim(), student_id.trim(), room_number.trim(), hostel_block.trim(), hashedPassword]
    );

    const newUser = result.rows[0];

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_production',
      { expiresIn: '24h' }
    );

    // Dispatch Welcome Email asynchronously
    const welcomeMail = emailTemplates.registrationWelcome(newUser.name, newUser.student_id);
    sendEmail({ to: newUser.email, ...welcomeMail });

    return res.status(201).json({
      success: true,
      message: 'Student registration successful! Welcome email sent.',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user (Student or Admin)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password, student_id, role } = req.body;
    const credential = password || student_id;

    if (!email || !credential) {
      return res.status(400).json({ success: false, message: 'Please enter required credentials.' });
    }

    const searchInput = email.toLowerCase().trim();
    // Search user by email or student_id (Roll Number)
    const result = await db.query(
      'SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 OR LOWER(TRIM(student_id)) = $1',
      [searchInput]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Account not found with this Email or Roll Number.' });
    }

    const user = result.rows[0];

    // Enforce role matching if role is passed
    if (role && user.role !== role) {
      if (role === 'admin' && user.role === 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This account is registered as a Student. Please switch to the Student Login tab.',
        });
      } else if (role === 'student' && user.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This account is registered as Warden / Admin. Please switch to the Warden Login tab.',
        });
      }
    }

    // If student, check if credential matches student_id (Roll Number), email, OR password hash
    if (user.role === 'student') {
      const inputCred = credential.toLowerCase().trim();
      const isIdMatch = user.student_id && user.student_id.toLowerCase().trim() === inputCred;
      const isEmailMatch = user.email && user.email.toLowerCase().trim() === inputCred;
      const isPassMatch = await bcrypt.compare(credential, user.password);

      if (!isIdMatch && !isEmailMatch && !isPassMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect Email or Student Roll Number.' });
      }
    } else {
      // Admin requires valid password
      const isMatch = await bcrypt.compare(credential, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Admin password incorrect.' });
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_production',
      { expiresIn: '24h' }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      student_id: user.student_id,
      room_number: user.room_number,
      hostel_block: user.hostel_block,
      role: user.role,
      created_at: user.created_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: userPayload,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Send reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your registered email address.' });
    }

    const userRes = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No account registered with this email address.' });
    }

    const user = userRes.rows[0];
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour validity

    // Store token in database
    await db.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailData = emailTemplates.passwordReset(user.name, resetUrl);
    await sendEmail({ to: user.email, ...mailData });

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been dispatched to your email.',
      data: { resetToken }, // Return token in response for convenience in testing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with Token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields (Token, New Password, Confirm Password) are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Find token record
    const tokenRes = await db.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
      [token]
    );

    if (tokenRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const resetRecord = tokenRes.rows[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in users table
    await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, resetRecord.user_id]);

    // Clean up reset token
    await db.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [resetRecord.user_id]);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
