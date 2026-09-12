const crypto = require('crypto');

/**
 * Generate unique Complaint ID in format CMP-YYYYMMDD-XXXX
 */
const generateComplaintId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${dateStr}-${randomDigits}`;
};

/**
 * Generate secure random token for password reset
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateComplaintId,
  generateResetToken,
};
