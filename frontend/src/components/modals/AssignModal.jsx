import React, { useState } from 'react';

const AssignModal = ({ show, onClose, onAssign, complaint }) => {
  const [assignedTo, setAssignedTo] = useState(complaint?.assigned_to || '');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!show || !complaint) return null;

  const defaultStaffList = [
    'Electrical Dept - Ramesh Kumar',
    'Plumbing Dept - Suresh Waterworks',
    'Wi-Fi & IT Helpdesk - NetCom Services',
    'Carpentry & Furniture - Mohan Crafts',
    'Housekeeping - Cleanliness Crew A',
    'Security Office - Main Gate',
    'Water Supply - Tank Maintenance',
    'General Hostel Warden Office',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAssign(complaint.id, { assigned_to: assignedTo, remarks });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-gear text-info me-2"></i>Assign Complaint Ticket
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">COMPLAINT TICKET</label>
                <input type="text" className="form-control bg-light" value={`${complaint.complaint_id} - ${complaint.title}`} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">ASSIGN TO DEPARTMENT / STAFF *</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter staff name or select from suggestions below"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                />
                <div className="d-flex flex-wrap gap-1">
                  {defaultStaffList.map((staff, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill fs-7"
                      onClick={() => setAssignedTo(staff)}
                    >
                      {staff.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">ASSIGNMENT INSTRUCTIONS / NOTES</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Instructions for technician..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success rounded-pill px-4" disabled={submitting}>
                {submitting ? 'Assigning...' : 'Assign Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
