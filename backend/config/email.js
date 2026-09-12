const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send Email Utility
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Hostel Complaint Portal" <no-reply@hostel.com>',
      to,
      subject,
      text: text || 'Hostel Complaint Management Notification',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched to ${to}: Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.warn(`[Nodemailer Warning] Could not dispatch email to ${to}:`, error.message);
    console.log(`[Email Preview Content] To: ${to} | Subject: ${subject}`);
    return false;
  }
};

/**
 * HTML Email Templates Generator
 */
const emailTemplates = {
  registrationWelcome: (name, studentId) => ({
    subject: 'Welcome to Hostel Complaint Portal - Registration Successful',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0d6efd;">Registration Successful</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Welcome to the Hostel Complaint Management Portal! Your account has been registered with Student ID: <strong>${studentId}</strong>.</p>
        <p>You can now log in to submit complaints, track resolution progress in real-time, and manage your student profile.</p>
        <hr style="border: 1px solid #eee;" />
        <p style="font-size: 12px; color: #777;">Hostel Administration & Management Team</p>
      </div>
    `,
  }),

  complaintSubmittedStudent: (name, complaintId, title, category, priority) => ({
    subject: `Complaint Received [${complaintId}] - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0d6efd;">Complaint Received</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your complaint has been successfully registered on our portal.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Complaint ID:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${complaintId}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Title:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${title}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Category:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${category}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Priority:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><span style="color: ${priority === 'Emergency' ? '#dc3545' : '#0d6efd'}">${priority}</span></td></tr>
        </table>
        <p>You can view live resolution steps on your student dashboard.</p>
        <hr style="border: 1px solid #eee;" />
        <p style="font-size: 12px; color: #777;">Hostel Management System</p>
      </div>
    `,
  }),

  complaintSubmittedAdminAlert: (complaintId, title, category, priority, roomNumber, studentName) => ({
    subject: `[ALERT] ${priority === 'Emergency' ? '🚨 EMERGENCY' : 'New'} Complaint ${complaintId} - Room ${roomNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: ${priority === 'Emergency' ? '#dc3545' : '#0d6efd'};">New Complaint Ticket Logging</h2>
        <p>A new complaint has been filed by student <strong>${studentName}</strong> (Room: <strong>${roomNumber}</strong>).</p>
        <ul style="line-height: 1.6;">
          <li><strong>ID:</strong> ${complaintId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Category:</strong> ${category}</li>
          <li><strong>Priority Level:</strong> <strong>${priority}</strong></li>
        </ul>
        <p>Please log in to the admin panel to assign maintenance personnel.</p>
      </div>
    `,
  }),

  complaintStatusUpdate: (name, complaintId, title, status, remarks, assignedTo) => ({
    subject: `Complaint Status Updated [${complaintId}] -> ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #198754;">Complaint Status Update</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>The status of your complaint <strong>${complaintId}</strong> ("${title}") has been updated to: <strong style="font-size: 16px; color: #0d6efd;">${status}</strong>.</p>
        ${assignedTo ? `<p><strong>Assigned Technician / Staff:</strong> ${assignedTo}</p>` : ''}
        ${remarks ? `<p><strong>Admin Remarks:</strong> ${remarks}</p>` : ''}
        <hr style="border: 1px solid #eee;" />
        <p style="font-size: 12px; color: #777;">Hostel Complaint Resolution Portal</p>
      </div>
    `,
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Hostel Portal - Password Reset Token Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0d6efd;">Password Reset Request</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested a password reset for your Hostel Complaint Management account.</p>
        <p>Click the link below to set a new password. This link is valid for 1 hour:</p>
        <p style="margin: 20px 0;"><a href="${resetUrl}" style="background: #0d6efd; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
