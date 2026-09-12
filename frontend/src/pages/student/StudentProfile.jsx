import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [roomNumber, setRoomNumber] = useState(user?.room_number || '');
  const [hostelBlock, setHostelBlock] = useState(user?.hostel_block || 'Kalpana Chawla Girls Hostel');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.put('/users/profile', {
        name,
        phone,
        room_number: roomNumber,
        hostel_block: hostelBlock,
      });

      if (res.success) {
        setMessage('Profile updated successfully.');
        updateUserProfile(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card custom-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <i className="bi bi-person-bounding-box text-primary display-5"></i>
              <div>
                <h4 className="fw-bold mb-0">Student Profile & Resident Information</h4>
                <p className="text-muted small mb-0">Update your contact information and room assignment</p>
              </div>
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
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">FULL NAME *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">EMAIL (READ-ONLY)</label>
                  <input type="email" className="form-control bg-light" value={user?.email || ''} disabled />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">STUDENT ROLL/ID (READ-ONLY)</label>
                  <input type="text" className="form-control bg-light" value={user?.student_id || 'N/A'} disabled />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">ROOM NUMBER *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">HOSTEL BLOCK *</label>
                  <select
                    className="form-select"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    required
                  >
                    <option value="Kalpana Chawla Girls Hostel">Kalpana Chawla Girls Hostel</option>
                    <option value="Himalaya Girls Hostel">Himalaya Girls Hostel</option>
                    <option value="Mata Gujri Girls Hostel">Mata Gujri Girls Hostel</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold" disabled={loading}>
                  {loading ? 'Saving Profile...' : 'Update Profile Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
