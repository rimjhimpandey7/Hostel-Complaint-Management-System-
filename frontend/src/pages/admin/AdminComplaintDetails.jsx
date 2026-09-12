import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import Timeline from '../../components/common/Timeline';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import AssignModal from '../../components/modals/AssignModal';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load complaint ticket details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/status`, payload);
    fetchComplaintDetails();
  };

  const handleAssign = async (complaintId, payload) => {
    await api.put(`/admin/complaints/${complaintId}/assign`, payload);
    fetchComplaintDetails();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading ticket details...</span>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="alert alert-danger p-4">
        <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        {error || 'Complaint ticket not found.'}
        <div className="mt-3">
          <Link to="/admin/complaints" className="btn btn-outline-danger rounded-pill px-3">
            Back to All Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-dark text-white px-3 py-1 mb-1">Ticket ID: {complaint.complaint_id}</span>
          <h4 className="fw-bold mb-0">{complaint.title}</h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-3" onClick={() => setShowStatusModal(true)}>
            <i className="bi bi-arrow-repeat me-1"></i> Update Status
          </button>
          <button className="btn btn-primary rounded-pill px-3" onClick={() => setShowAssignModal(true)}>
            <i className="bi bi-person-plus me-1"></i> Assign Staff
          </button>
          <Link to="/admin/complaints" className="btn btn-outline-secondary rounded-pill px-3">
            <i className="bi bi-arrow-left me-1"></i> Back
          </Link>
        </div>
      </div>

      {/* Visual Timeline Tracking */}
      <Timeline currentStatus={complaint.status} timeline={complaint.timeline} />

      <div className="row g-4">
        {/* Main Details */}
        <div className="col-lg-8">
          <div className="card custom-card p-4 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 text-dark">Issue Specification</h5>
            <p className="text-secondary fs-6 leading-relaxed mb-4">{complaint.description}</p>

            {complaint.image && (
              <div className="mb-4">
                <h6 className="fw-bold text-muted small mb-2">ATTACHED SNAPSHOT FROM STUDENT</h6>
                <div className="image-preview-container border rounded overflow-hidden">
                  <img
                    src={getImageUrl(complaint.image)}
                    alt="Complaint Snapshot"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x300?text=Attached+Image+Preview';
                    }}
                  />
                </div>
              </div>
            )}

            {complaint.admin_remarks && (
              <div className="alert alert-info border-0 shadow-sm mt-3">
                <h6 className="fw-bold text-info mb-1">
                  <i className="bi bi-chat-left-quote me-2"></i>Recorded Admin Remarks
                </h6>
                <p className="mb-0 text-dark">{complaint.admin_remarks}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="card custom-card p-4 mb-4">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Student & Ticket Meta</h6>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Complainant Student</small>
              <div className="fw-bold text-dark">{complaint.student_name}</div>
              <small className="text-primary d-block">Roll ID: {complaint.student_id || 'N/A'}</small>
              <small className="text-muted d-block"><i className="bi bi-envelope me-1"></i>{complaint.student_email}</small>
              <small className="text-muted d-block"><i className="bi bi-telephone me-1"></i>{complaint.student_phone}</small>
            </div>

            <hr />

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Room & Hostel Block</small>
              <span className="fw-bold text-dark">Room {complaint.room_number} ({complaint.hostel_block || 'Hostel'})</span>
            </div>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Current Status</small>
              <div className="mt-1"><StatusBadge status={complaint.status} /></div>
            </div>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Priority Level</small>
              <div className="mt-1"><PriorityBadge priority={complaint.priority} /></div>
            </div>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Category</small>
              <span className="fw-semibold text-dark">{complaint.category}</span>
            </div>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Assigned Department / Staff</small>
              <span className="fw-bold text-primary">
                {complaint.assigned_to ? complaint.assigned_to : 'Not Assigned'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSave={handleUpdateStatus}
        complaint={complaint}
      />

      <AssignModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssign}
        complaint={complaint}
      />
    </div>
  );
};

export default AdminComplaintDetails;
