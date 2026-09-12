import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import Timeline from '../../components/common/Timeline';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <Link to="/student/my-complaints" className="btn btn-outline-danger rounded-pill px-3">
            Back to My Complaints
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
        <Link to="/student/my-complaints" className="btn btn-outline-secondary rounded-pill px-4">
          <i className="bi bi-arrow-left me-1"></i> Back to List
        </Link>
      </div>

      {/* Visual Timeline Tracking */}
      <Timeline currentStatus={complaint.status} timeline={complaint.timeline} />

      <div className="row g-4">
        {/* Main Complaint Overview */}
        <div className="col-lg-8">
          <div className="card custom-card p-4 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 text-dark">Issue Specification</h5>
            <p className="text-secondary fs-6 leading-relaxed mb-4">{complaint.description}</p>

            {complaint.image && (
              <div className="mb-4">
                <h6 className="fw-bold text-muted small mb-2">ATTACHED ISSUE SNAPSHOT</h6>
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
                  <i className="bi bi-chat-left-quote me-2"></i>Administration Remarks
                </h6>
                <p className="mb-0 text-dark">{complaint.admin_remarks}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Attributes */}
        <div className="col-lg-4">
          <div className="card custom-card p-4 mb-4">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Ticket Metadata</h6>

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
              <small className="text-muted text-uppercase fw-bold d-block">Room Number & Hostel</small>
              <span className="fw-semibold text-dark">{complaint.room_number} ({complaint.hostel_block || 'Hostel Block'})</span>
            </div>

            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold d-block">Assigned Staff / Dept</small>
              <span className="fw-semibold text-primary">
                {complaint.assigned_to ? complaint.assigned_to : 'Not Yet Assigned'}
              </span>
            </div>

            <hr />

            <div className="mb-2">
              <small className="text-muted d-block">Created On:</small>
              <small className="fw-semibold text-dark">{new Date(complaint.created_at).toLocaleString()}</small>
            </div>

            <div className="mb-2">
              <small className="text-muted d-block">Last Updated:</small>
              <small className="fw-semibold text-dark">{new Date(complaint.updated_at).toLocaleString()}</small>
            </div>

            {complaint.resolved_at && (
              <div className="mb-2">
                <small className="text-success d-block fw-bold">Resolved On:</small>
                <small className="fw-semibold text-success">{new Date(complaint.resolved_at).toLocaleString()}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
