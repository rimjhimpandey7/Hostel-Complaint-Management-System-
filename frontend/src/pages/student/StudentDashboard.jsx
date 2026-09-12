import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/my');
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Card Counter Computations
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Search & Filter Filtering
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_id.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Top Welcome Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Welcome back, {user?.name}!</h4>
          <p className="text-muted mb-0">
            Resident of <strong className="text-dark">{user?.hostel_block || 'Hostel'}</strong> — Room <strong className="text-dark">{user?.room_number || 'N/A'}</strong>
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/student/submit-complaint" className="btn btn-primary rounded-pill px-4 shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Submit New Complaint
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card bg-primary shadow-sm">
            <small className="text-uppercase fw-bold opacity-75">Total Complaints</small>
            <h2 className="fw-bold my-1">{totalCount}</h2>
            <small className="opacity-90">Logged since account creation</small>
            <i className="bi bi-folder-fill stat-icon"></i>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card bg-warning text-dark shadow-sm">
            <small className="text-uppercase fw-bold opacity-75">Pending</small>
            <h2 className="fw-bold my-1">{pendingCount}</h2>
            <small className="opacity-90">Awaiting admin review</small>
            <i className="bi bi-hourglass-split stat-icon"></i>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card bg-info text-white shadow-sm">
            <small className="text-uppercase fw-bold opacity-75">In Progress</small>
            <h2 className="fw-bold my-1">{inProgressCount}</h2>
            <small className="opacity-90">Assigned / technician on site</small>
            <i className="bi bi-tools stat-icon"></i>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card bg-success shadow-sm">
            <small className="text-uppercase fw-bold opacity-75">Resolved</small>
            <h2 className="fw-bold my-1">{resolvedCount}</h2>
            <small className="opacity-90">Successfully closed tickets</small>
            <i className="bi bi-check-circle-fill stat-icon"></i>
          </div>
        </div>
      </div>

      {/* Complaints List Table with Filter */}
      <div className="card custom-card p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h5 className="fw-bold mb-0">Recent Submitted Complaints</h5>

          <div className="d-flex flex-wrap gap-2">
            <div className="input-group input-group-sm" style={{ width: '240px' }}>
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search complaint ID/title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-select form-select-sm"
              style={{ width: '150px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading complaints...</span>
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-4 mb-2 d-block opacity-50"></i>
            <p className="mb-2 fw-semibold">No complaint records found.</p>
            <small className="d-block mb-3">Submit your first maintenance complaint to track resolution online.</small>
            <Link to="/student/submit-complaint" className="btn btn-sm btn-outline-primary rounded-pill px-3">
              Submit Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table align-middle">
              <thead className="table-light text-muted fs-7 text-uppercase">
                <tr>
                  <th>Complaint ID</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.slice(0, 10).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="fw-bold text-dark">{c.complaint_id}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{c.category}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '220px' }}>{c.title}</div>
                      <small className="text-muted">Room {c.room_number}</small>
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <small className="text-muted">{new Date(c.created_at).toLocaleDateString()}</small>
                    </td>
                    <td className="text-end">
                      <Link to={`/student/complaints/${c.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        Track Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
