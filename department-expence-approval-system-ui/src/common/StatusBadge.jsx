import { CLAIM_STATUS } from '../constants';

const STATUS_CONFIG = {
  [CLAIM_STATUS.APPROVED]: {
    className: 'ef-badge ef-badge-approved',
    icon: 'bi-check-circle-fill',
    label: 'Approved',
  },
  [CLAIM_STATUS.REJECTED]: {
    className: 'ef-badge ef-badge-rejected',
    icon: 'bi-x-circle-fill',
    label: 'Rejected',
  },
  [CLAIM_STATUS.PENDING]: {
    className: 'ef-badge ef-badge-pending',
    icon: 'bi-clock-fill',
    label: 'Pending',
  },
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    className: 'ef-badge',
    icon: 'bi-circle',
    label: status || 'Unknown',
  };

  return (
    <span className={config.className} aria-label={`Status: ${config.label}`}>
      <i className={`bi ${config.icon}`} style={{ fontSize: 9 }} aria-hidden="true" />
      {config.label}
    </span>
  );
};
