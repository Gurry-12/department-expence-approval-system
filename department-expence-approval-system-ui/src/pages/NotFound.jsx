import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export const NotFound = () => (
  <div
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 80, height: 80, borderRadius: 20, background: '#EFF6FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, fontSize: 36, color: '#2563EB',
      }}
      aria-hidden="true"
    >
      <i className="bi bi-compass" />
    </div>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Page Not Found</h1>
    <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px', maxWidth: 360 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to={ROUTES.HOME} className="btn btn-primary">
      <i className="bi bi-arrow-left me-2" aria-hidden="true" />
      Back to Dashboard
    </Link>
  </div>
);
