import React, { useState } from 'react';
import api from '../../services/api';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setError('New password and confirm password do not match.');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setMessage('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'Failed to change password. Please verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <i className="bi bi-shield-lock text-warning display-4 mb-2"></i>
              <h4 className="fw-bold text-dark">Change Account Password</h4>
              <p className="text-muted small">Update your security credentials regularly to secure your portal access</p>
            </div>

            {message && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{message}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">CURRENT PASSWORD *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">NEW PASSWORD *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">CONFIRM NEW PASSWORD *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-warning w-100 py-2 rounded-pill fw-bold" disabled={loading}>
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
