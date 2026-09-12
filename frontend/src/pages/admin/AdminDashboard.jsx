import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CategoryChart from '../../components/charts/CategoryChart';
import StatusChart from '../../components/charts/StatusChart';
import PriorityChart from '../../components/charts/PriorityChart';
import TimelineChart from '../../components/charts/TimelineChart';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import AssignModal from '../../components/modals/AssignModal';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, complaintsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/complaints'),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (complaintsRes.success) setRecentComplaints(complaintsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/status`, payload);
    fetchDashboardData();
  };

  const handleAssign = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/assign`, payload);
    fetchDashboardData();
  };

  const counters = analytics?.counters || {};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Hostel Warden & Admin Command Center</h4>
          <p className="text-muted mb-0">Overview of student grievance tickets, staff allocations, and interactive analytics</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Analytics & Metrics...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-dark shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">Students</small>
                <h3 className="fw-bold my-1">{counters.total_students || 0}</h3>
                <small className="opacity-75">Registered</small>
                <i className="bi bi-people-fill stat-icon"></i>
              </div>
            </div>

            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-primary shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">Total Tickets</small>
                <h3 className="fw-bold my-1">{counters.total_complaints || 0}</h3>
                <small className="opacity-75">All categories</small>
                <i className="bi bi-journal-text stat-icon"></i>
              </div>
            </div>

            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-warning text-dark shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">Pending</small>
                <h3 className="fw-bold my-1">{counters.pending_complaints || 0}</h3>
                <small className="opacity-75">Requires action</small>
                <i className="bi bi-clock-history stat-icon"></i>
              </div>
            </div>

            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-info text-white shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">In Progress</small>
                <h3 className="fw-bold my-1">{parseInt(counters.in_progress_complaints || 0) + parseInt(counters.assigned_complaints || 0)}</h3>
                <small className="opacity-75">Staff assigned</small>
                <i className="bi bi-tools stat-icon"></i>
              </div>
            </div>

            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-success shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">Resolved</small>
                <h3 className="fw-bold my-1">{counters.resolved_complaints || 0}</h3>
                <small className="opacity-75">Closed tickets</small>
                <i className="bi bi-check2-circle stat-icon"></i>
              </div>
            </div>

            <div className="col-6 col-lg-4 col-xl-2">
              <div className="stat-card bg-danger shadow-sm">
                <small className="text-uppercase fw-bold opacity-75">Emergency</small>
                <h3 className="fw-bold my-1">{counters.emergency_complaints || 0}</h3>
                <small className="opacity-75">High priority</small>
                <i className="bi bi-exclamation-triangle-fill stat-icon"></i>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Charts Grid */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <CategoryChart data={analytics?.byCategory} />
            </div>
            <div className="col-lg-6">
              <StatusChart data={analytics?.byStatus} />
            </div>
            <div className="col-lg-6">
              <PriorityChart data={analytics?.byPriority} />
            </div>
            <div className="col-lg-6">
              <TimelineChart data={analytics?.overTime} />
            </div>
          </div>

          {/* Recent Complaints Master Table */}
          <div className="card custom-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Complaint Filings</h5>
              <Link to="/admin/complaints" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                View All Complaints ({recentComplaints.length})
              </Link>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="text-center py-4 text-muted">No complaint tickets logged yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table custom-table align-middle">
                  <thead className="table-light text-muted fs-7 text-uppercase">
                    <tr>
                      <th>Ticket ID</th>
                      <th>Student & Room</th>
                      <th>Category & Title</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.slice(0, 7).map((c) => (
                      <tr key={c.id}>
                        <td><span className="fw-bold text-dark">{c.complaint_id}</span></td>
                        <td>
                          <div className="fw-semibold">{c.student_name}</div>
                          <small className="text-muted">Room {c.room_number} ({c.hostel_block})</small>
                        </td>
                        <td>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>{c.title}</div>
                          <span className="badge bg-light text-dark border fs-7">{c.category}</span>
                        </td>
                        <td><PriorityBadge priority={c.priority} /></td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>
                          <small className={c.assigned_to ? 'text-primary fw-semibold' : 'text-muted'}>
                            {c.assigned_to || 'Unassigned'}
                          </small>
                        </td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-success rounded-start px-2"
                              title="Update Status"
                              onClick={() => {
                                setSelectedComplaint(c);
                                setShowStatusModal(true);
                              }}
                            >
                              <i className="bi bi-arrow-repeat"></i> Status
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-end px-2"
                              title="Assign Staff"
                              onClick={() => {
                                setSelectedComplaint(c);
                                setShowAssignModal(true);
                              }}
                            >
                              <i className="bi bi-person-plus"></i> Assign
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
        </>
      )}

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
    </div>
  );
};

export default AdminDashboard;
