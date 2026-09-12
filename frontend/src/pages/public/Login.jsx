import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [credential, setCredential] = useState(''); // password for admin, student_id (roll number) for student
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send email, credential (password or student_id), and selected role tab
      const res = await login(email, credential, loginType);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'admin') {
      setLoginType('admin');
      setEmail('warden@hostel.com');
      setCredential('password123');
    } else {
      setLoginType('student');
      setEmail('priya.sharma@student.com');
      setCredential('STU-2024-001');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card custom-card p-4 p-md-5 border-0 shadow-lg">
            <div className="text-center mb-4">
              <i className="bi bi-shield-lock-fill text-primary display-4 mb-2"></i>
              <h3 className="fw-bold text-dark">Portal Sign In</h3>
              <p className="text-muted small">Select your role to sign into the Hostel Management System</p>
            </div>

            {/* Login Role Toggle Tabs */}
            <div className="nav nav-pills nav-justified mb-4 p-1 bg-light rounded-pill border">
              <button
                type="button"
                className={`nav-link rounded-pill fw-bold py-2 ${loginType === 'student' ? 'active bg-primary text-white' : 'text-muted'}`}
                onClick={() => {
                  setLoginType('student');
                  setError('');
                }}
              >
                <i className="bi bi-person-fill me-1"></i> Student Login
              </button>
              <button
                type="button"
                className={`nav-link rounded-pill fw-bold py-2 ${loginType === 'admin' ? 'active bg-dark text-white' : 'text-muted'}`}
                onClick={() => {
                  setLoginType('admin');
                  setError('');
                }}
              >
                <i className="bi bi-shield-fill-check me-1"></i> Warden / Admin
              </button>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <small>{error}</small>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  {loginType === 'student' ? 'STUDENT EMAIL ADDRESS *' : 'WARDEN / ADMIN EMAIL *'}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder={loginType === 'student' ? 'priya.sharma@student.com' : 'warden@hostel.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {loginType === 'student' ? (
                /* Student Roll Number / ID Field */
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">STUDENT ROLL NUMBER / ID *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-card-text"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. STU-2024-001"
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      required
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Enter your registered Student ID / Roll Number to log in
                  </small>
                </div>
              ) : (
                /* Admin Password Field */
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label text-muted small fw-bold mb-0">ADMIN PASSWORD *</label>
                    <Link to="/forgot-password" className="fs-7 text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-key"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter admin password"
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold mb-3 shadow-sm" disabled={loading}>
                {loading ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</span>
                ) : (
                  loginType === 'student' ? 'Login as Student' : 'Login as Warden / Admin'
                )}
              </button>
            </form>

            <div className="border-top pt-3 mt-3">
              <span className="d-block text-center text-muted fs-7 mb-2 fw-semibold">QUICK DEMO LOGIN CREDENTIALS:</span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary w-50 rounded-pill fs-7"
                  onClick={() => handleDemoLogin('student')}
                >
                  <i className="bi bi-person me-1"></i> Demo Student (Roll No)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark w-50 rounded-pill fs-7"
                  onClick={() => handleDemoLogin('admin')}
                >
                  <i className="bi bi-shield me-1"></i> Demo Warden (Pass)
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted fs-7">Don't have a student account? </span>
              <Link to="/register" className="fw-bold text-primary text-decoration-none">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
