import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../context';
import { ROUTES } from '../constants';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useRole();
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
};
