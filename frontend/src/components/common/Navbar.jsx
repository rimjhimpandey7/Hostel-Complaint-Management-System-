import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <i className="bi bi-building-gear text-primary fs-3"></i>
          <span>HostelCare <span className="badge bg-primary fs-6 fw-normal">Portal</span></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium" to="/">Home</Link>
            </li>
            {isAuthenticated && user?.role === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/student/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/student/submit-complaint">Submit Complaint</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/student/my-complaints">My Complaints</Link>
                </li>
              </>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/admin/complaints">All Complaints</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/admin/analytics">Analytics</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium" to="/admin/students">Manage Students</Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user?.name} ({user?.role === 'admin' ? 'Admin' : 'Student'})</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to={user?.role === 'admin' ? '/admin/profile' : '/student/profile'}
                    >
                      <i className="bi bi-person me-1"></i> Profile & Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/student/change-password">
                      <i className="bi bi-key me-1"></i> Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4">Login</Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-4">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
