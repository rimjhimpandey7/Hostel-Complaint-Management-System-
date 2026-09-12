import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message || 'Password reset token link sent to your email.');
      if (res.data?.resetToken) {
        setDemoToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.message || 'Error initiating password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card custom-card p-4 p-md-5 border-0 shadow-lg">
            <div className="text-center mb-4">
              <i className="bi bi-key-fill text-warning display-4 mb-2"></i>
              <h3 className="fw-bold text-dark">Forgot Password</h3>
              <p className="text-muted small">Enter your registered email to receive a password reset token</p>
            </div>

            {message && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <small>{message}</small>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <small>{error}</small>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">REGISTERED EMAIL ADDRESS *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold mb-3" disabled={loading}>
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </button>
            </form>

            {demoToken && (
              <div className="bg-light p-3 rounded border mt-3 text-center">
                <small className="text-muted d-block mb-1">Testing Convenience Token:</small>
                <Link to={`/reset-password?token=${demoToken}`} className="btn btn-sm btn-outline-success rounded-pill fw-bold">
                  Proceed to Reset Page with Token
                </Link>
              </div>
            )}

            <div className="text-center mt-4">
              <Link to="/login" className="text-decoration-none text-secondary fs-7">
                <i className="bi bi-arrow-left me-1"></i> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
