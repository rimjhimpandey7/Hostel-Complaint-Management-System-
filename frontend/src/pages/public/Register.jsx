import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    student_id: '',
    room_number: '',
    hostel_block: 'Kalpana Chawla Girls Hostel',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Email or Student ID may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card custom-card p-4 p-md-5 border-0 shadow-lg">
            <div className="text-center mb-4">
              <i className="bi bi-person-plus-fill text-primary display-4 mb-2"></i>
              <h3 className="fw-bold text-dark">Student Account Registration</h3>
              <p className="text-muted small">Fill out your resident profile details to register for hostel complaint tracking</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">FULL NAME *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="e.g. rahul@student.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. +91 9812345678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">STUDENT ROLL/ID *</label>
                  <input
                    type="text"
                    name="student_id"
                    className="form-control"
                    placeholder="e.g. STU-2024-005"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">ROOM NUMBER *</label>
                  <input
                    type="text"
                    name="room_number"
                    className="form-control"
                    placeholder="e.g. B-204"
                    value={formData.room_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">HOSTEL BLOCK *</label>
                  <select
                    name="hostel_block"
                    className="form-select"
                    value={formData.hostel_block}
                    onChange={handleChange}
                    required
                  >
                    <option value="Kalpana Chawla Girls Hostel">Kalpana Chawla Girls Hostel</option>
                    <option value="Himalaya Girls Hostel">Himalaya Girls Hostel</option>
                    <option value="Mata Gujri Girls Hostel">Mata Gujri Girls Hostel</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">PASSWORD *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">CONFIRM PASSWORD *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={loading}>
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</span>
                  ) : (
                    'Register Student Account'
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted fs-7">Already have a registered account? </span>
              <Link to="/login" className="fw-bold text-primary text-decoration-none">
                Log In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
