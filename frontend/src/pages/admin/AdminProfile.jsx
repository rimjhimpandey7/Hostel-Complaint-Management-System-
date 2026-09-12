import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();

  // Profile details state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  // Handle Profile Update (Name, Email, Phone)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErr('');
    setProfileMsg('');
    setLoadingProfile(true);

    try {
      const res = await api.put('/users/profile', { name, email, phone });
      if (res.success) {
        setProfileMsg('Admin details & email updated successfully.');
        updateUserProfile(res.data);
      }
    } catch (err) {
      setProfileErr(err.message || 'Failed to update admin details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassErr('');
    setPassMsg('');

    if (newPassword !== confirmPassword) {
      setPassErr('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPassErr('New password must be at least 6 characters long.');
      return;
    }

    setLoadingPass(true);

    try {
      const res = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setPassMsg('Admin password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPassErr(err.message || 'Failed to update password.');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center g-4">
        {/* Left Column: Admin Profile Settings */}
        <div className="col-lg-7">
          <div className="card custom-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                <i className="bi bi-person-gear fs-2"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0">Warden & Administrator Profile</h4>
                <p className="text-muted small mb-0">Update admin contact info and email login address</p>
              </div>
            </div>

            {profileMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{profileMsg}</div>
              </div>
            )}

            {profileErr && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{profileErr}</div>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label text-muted small fw-bold">ADMINISTRATOR / WARDEN NAME *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">ADMIN EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="warden@hostel.com"
                    required
                  />
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Used for Admin login</small>
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

                <div className="col-md-12">
                  <label className="form-label text-muted small fw-bold">ROLE & PERMISSIONS</label>
                  <input type="text" className="form-control bg-light text-success fw-bold" value="Super Administrator / Hostel Warden" disabled />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold" disabled={loadingProfile}>
                  {loadingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Change Admin Password */}
        <div className="col-lg-5">
          <div className="card custom-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                <i className="bi bi-shield-lock-fill fs-2"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0">Change Password</h4>
                <p className="text-muted small mb-0">Update admin security credentials</p>
              </div>
            </div>

            {passMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{passMsg}</div>
              </div>
            )}

            {passErr && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{passErr}</div>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
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
                  placeholder="Minimum 6 characters"
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

              <div className="pt-2 border-top">
                <button type="submit" className="btn btn-warning rounded-pill px-4 fw-bold w-100" disabled={loadingPass}>
                  {loadingPass ? 'Updating Password...' : 'Update Admin Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
