import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="sidebar-container p-3 d-flex flex-column justify-content-between shadow">
      <div>
        <div className="d-flex align-items-center gap-2 mb-4 px-2 pt-2 border-bottom border-secondary pb-3">
          <i className={`bi ${isAdmin ? 'bi-shield-lock-fill text-warning' : 'bi-person-badge-fill text-info'} fs-3`}></i>
          <div>
            <h6 className="mb-0 text-white fw-bold">{user?.name}</h6>
            <small className="text-muted text-uppercase">{isAdmin ? 'Administrator' : `Room: ${user?.room_number || 'N/A'}`}</small>
          </div>
        </div>

        <div className="nav flex-column gap-1">
          <span className="text-uppercase text-muted fs-7 fw-bold px-2 mb-1">Main Menu</span>

          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-speedometer2"></i> Admin Dashboard
              </NavLink>
              <NavLink to="/admin/complaints" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-list-task"></i> All Complaints
              </NavLink>
              <NavLink to="/admin/analytics" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-bar-chart-line-fill"></i> Analytics
              </NavLink>
              <NavLink to="/admin/students" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-people-fill"></i> Manage Students
              </NavLink>
              <NavLink to="/admin/profile" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-gear-fill"></i> Admin Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-grid-fill"></i> Overview Dashboard
              </NavLink>
              <NavLink to="/student/submit-complaint" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-plus-circle-fill"></i> Submit Complaint
              </NavLink>
              <NavLink to="/student/my-complaints" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-card-checklist"></i> My Complaints
              </NavLink>
              <NavLink to="/student/profile" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-person-lines-fill"></i> Profile & Room Info
              </NavLink>
              <NavLink to="/student/change-password" className={({ isActive }) => `nav-link rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${isActive ? 'bg-primary fw-bold' : ''}`}>
                <i className="bi bi-key-fill"></i> Security Settings
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="pt-3 border-top border-secondary text-center text-muted fs-7">
        <p className="mb-0">Hostel Portal v1.0.0</p>
        <small>© 2026 Admin Warden Office</small>
      </div>
    </aside>
  );
};

export default Sidebar;
