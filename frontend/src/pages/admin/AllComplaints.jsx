import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import AssignModal from '../../components/modals/AssignModal';
import DeleteModal from '../../components/modals/DeleteModal';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

      const res = await api.get('/admin/complaints', { params });
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

  const handleUpdateStatus = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/status`, payload);
    fetchComplaints();
  };

  const handleAssign = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/assign`, payload);
    fetchComplaints();
  };

  const handleDelete = async () => {
    if (selectedComplaint) {
      await api.delete(`/admin/complaints/${selectedComplaint.id}`);
      setShowDeleteModal(false);
      fetchComplaints();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Master Complaint Tickets Management</h4>
          <p className="text-muted mb-0">Search, filter, assign maintenance staff, update status, and purge invalid tickets</p>
        </div>
      </div>

      {/* Search & Filter Options */}
      <div className="card custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="ID, Title, Student, Room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
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
              Filter List
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Master Table */}
      <div className="card custom-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading tickets...</span>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-5 text-muted">No complaint tickets match your query.</div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table align-middle">
              <thead className="table-light text-muted fs-7 text-uppercase">
                <tr>
                  <th>Ticket ID</th>
                  <th>Student Name</th>
                  <th>Room & Block</th>
                  <th>Title & Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="fw-bold text-dark">{c.complaint_id}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{c.student_name}</div>
                      <small className="text-muted">{c.student_id || c.student_email}</small>
                    </td>
                    <td>
                      <span className="fw-semibold text-dark">{c.room_number}</span>
                      <small className="d-block text-muted">{c.hostel_block}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>{c.title}</div>
                      <span className="badge bg-light text-dark border fs-7">{c.category}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <small className={c.assigned_to ? 'text-primary fw-bold' : 'text-muted'}>
                        {c.assigned_to || 'Unassigned'}
                      </small>
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="btn btn-sm btn-outline-secondary"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Change Status"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setShowStatusModal(true);
                          }}
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Assign Staff"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setShowAssignModal(true);
                          }}
                        >
                          <i className="bi bi-person-plus"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Ticket"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <StatusUpdateModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSave={handleUpdateStatus}
        complaint={selectedComplaint}
      />

      <AssignModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssign}
        complaint={selectedComplaint}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Delete Inappropriate Complaint"
        message={`Are you sure you want to delete complaint ticket '${selectedComplaint?.complaint_id}'? This record will be permanently purged from database records.`}
      />
    </div>
  );
};

export default AllComplaints;
