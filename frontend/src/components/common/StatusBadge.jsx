import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (st) => {
    switch (st) {
      case 'Pending':
        return 'badge-status-pending';
      case 'Assigned':
        return 'badge-status-assigned';
      case 'In Progress':
        return 'badge-status-in-progress';
      case 'Resolved':
        return 'badge-status-resolved';
      case 'Rejected':
        return 'badge-status-rejected';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getIcon = (st) => {
    switch (st) {
      case 'Pending':
        return 'bi-clock-history';
      case 'Assigned':
        return 'bi-person-check-fill';
      case 'In Progress':
        return 'bi-gear-wide-connected';
      case 'Resolved':
        return 'bi-check-circle-fill';
      case 'Rejected':
        return 'bi-x-circle-fill';
      default:
        return 'bi-info-circle';
    }
  };

  return (
    <span className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 ${getBadgeClass(status)}`}>
      <i className={`bi ${getIcon(status)}`}></i>
      <span>{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;
