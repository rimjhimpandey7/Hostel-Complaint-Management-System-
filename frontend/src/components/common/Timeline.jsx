import React from 'react';

const Timeline = ({ currentStatus, timeline = [] }) => {
  const steps = [
    { key: 'Pending', label: 'Submitted', icon: 'bi-send-check' },
    { key: 'Assigned', label: 'Assigned', icon: 'bi-person-plus' },
    { key: 'In Progress', label: 'In Progress', icon: 'bi-tools' },
    { key: 'Resolved', label: 'Resolved', icon: 'bi-check2-all' },
  ];

  const isRejected = currentStatus === 'Rejected';

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Assigned': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="card custom-card p-4 mb-4">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-diagram-3-fill text-primary"></i> Complaint Resolution Progress Tracker
      </h6>

      {isRejected ? (
        <div className="alert alert-secondary d-flex align-items-center gap-2 mb-0">
          <i className="bi bi-x-circle-fill text-danger fs-4"></i>
          <div>
            <strong>Complaint Rejected</strong>
            <p className="mb-0 small">This complaint ticket was evaluated and rejected by the administration.</p>
          </div>
        </div>
      ) : (
        <div className="row g-2 text-center my-3">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;

            return (
              <div className="col-3" key={step.key}>
                <div className={`p-3 rounded border transition-all ${isCurrent ? 'bg-primary text-white shadow' : isCompleted ? 'bg-light text-success border-success fw-semibold' : 'bg-light text-muted'}`}>
                  <div className="fs-3 mb-1">
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <div className="small fw-bold">{step.label}</div>
                  {isCurrent && <span className="badge bg-warning text-dark fs-7 mt-1">Active Step</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed History Log */}
      {timeline.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <h6 className="fw-semibold text-muted mb-3 fs-7 text-uppercase">Status Activity Log</h6>
          <ul className="timeline px-0">
            {timeline.map((item, index) => (
              <li key={index} className={`timeline-item ${index === timeline.length - 1 ? 'active' : ''}`}>
                <div className="timeline-marker"></div>
                <div className="ms-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark">{item.status}</span>
                    <span className="text-muted fs-7">
                      • {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  {item.updater_name && (
                    <small className="text-primary d-block">
                      Updated by: {item.updater_name} ({item.updater_role})
                    </small>
                  )}
                  {item.remarks && (
                    <p className="mb-0 text-secondary bg-light p-2 rounded mt-1 fs-7 border">
                      "{item.remarks}"
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timeline;
