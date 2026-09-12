import React from 'react';

const DeleteModal = ({ show, onClose, onDelete, title, message }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-exclamation-octagon-fill me-2"></i>{title || 'Confirm Action'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <p className="mb-0 fs-6 text-dark">{message || 'Are you sure you want to delete this record? This action cannot be undone.'}</p>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger rounded-pill px-4" onClick={onDelete}>
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
