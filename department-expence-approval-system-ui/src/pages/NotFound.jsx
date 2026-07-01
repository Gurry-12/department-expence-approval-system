import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
      <h4 className="text-secondary mb-4">Page Not Found</h4>
      <p className="text-muted mb-4 text-center" style={{ maxWidth: '400px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to={ROUTES.HOME} className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
        <i className="bi bi-house-door me-2"></i>
        Return to Dashboard
      </Link>
    </div>
  );
};
