import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [category, status, priority]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (search) params.search = search;

      const res = await api.get('/complaints/my', { params });
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">My Submitted Complaints</h4>
          <p className="text-muted mb-0">Search, filter, and track all your logged hostel complaint tickets</p>
        </div>
        <Link to="/student/submit-complaint" className="btn btn-primary rounded-pill px-4 shadow-sm">
          <i className="bi bi-plus-lg me-1"></i> New Complaint
        </Link>
      </div>

      {/* Filter Control Panel */}
      <div className="card custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search Title or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-2">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Wi-Fi/Internet">Wi-Fi/Internet</option>
              <option value="Furniture">Furniture</option>
              <option value="Food/Mess">Food/Mess</option>
              <option value="Security">Security</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Room Maintenance">Room Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="col-md-2 text-end">
            <button type="submit" className="btn btn-outline-primary w-100 rounded-pill">
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="card custom-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading complaints...</span>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-4 mb-2 d-block opacity-50"></i>
            <p className="mb-0 fw-semibold">No complaints found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table align-middle">
              <thead className="table-light text-muted fs-7 text-uppercase">
                <tr>
                  <th>Ticket ID</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Room</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="fw-bold text-dark">{c.complaint_id}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{c.category}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '240px' }}>{c.title}</div>
                    </td>
                    <td>{c.room_number}</td>
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
                      <Link to={`/student/complaints/${c.id}`} className="btn btn-sm btn-primary rounded-pill px-3">
                        View & Track
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

export default MyComplaints;
