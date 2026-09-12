import React, { useState } from 'react';

const StatusUpdateModal = ({ show, onClose, onSave, complaint }) => {
  const [status, setStatus] = useState(complaint?.status || 'In Progress');
  const [remarks, setRemarks] = useState(complaint?.admin_remarks || '');
  const [submitting, setSubmitting] = useState(false);

  if (!show || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(complaint.id, { status, remarks });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block tab-modal-bg" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-arrow-repeat text-primary me-2"></i>Update Complaint Status
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">COMPLAINT ID</label>
                <input type="text" className="form-control bg-light" value={complaint.complaint_id} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">SELECT NEW STATUS *</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">ADMIN REMARKS / NOTES</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Provide status updates, inspection details, or resolution notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={submitting}>
                {submitting ? 'Updating...' : 'Save Status Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
