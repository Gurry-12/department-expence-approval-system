import { CLAIM_STATUS } from '../constants';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case CLAIM_STATUS.APPROVED: return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case CLAIM_STATUS.REJECTED: return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case CLAIM_STATUS.PENDING: return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <span className={`badge rounded-pill px-3 py-2 fw-normal ${getBadgeClass(status)}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};
