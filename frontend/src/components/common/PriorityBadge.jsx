import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getPriorityClass = (p) => {
    switch (p) {
      case 'Low':
        return 'badge-priority-low';
      case 'Medium':
        return 'badge-priority-medium';
      case 'High':
        return 'badge-priority-high';
      case 'Emergency':
        return 'badge-priority-emergency';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <span className={`badge rounded-pill px-3 py-1 ${getPriorityClass(priority)}`}>
      {priority === 'Emergency' && <i className="bi bi-exclamation-triangle-fill me-1"></i>}
      {priority || 'Medium'}
    </span>
  );
};

export default PriorityBadge;
