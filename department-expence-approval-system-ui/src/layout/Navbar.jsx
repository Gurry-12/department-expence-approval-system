import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useRole, ROLES } from '../context';

export const Navbar = ({ toggleSidebar, onMobileOpen }) => {
  const { role, toggleRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSwitch = () => {
    toggleRole();
    navigate(ROUTES.HOME);
  };

  const otherRole = role === ROLES.EMPLOYEE ? ROLES.FINANCE_MANAGER : ROLES.EMPLOYEE;
  const roleInitial = role === ROLES.FINANCE_MANAGER ? 'FM' : 'E';

  return (
    <>
      <a href="#main-content" className="ef-skip-link">Skip to main content</a>
      <header className="ef-topbar">
        {/* Mobile hamburger */}
        <button
          className="ef-hamburger"
          onClick={onMobileOpen}
          aria-label="Open navigation menu"
        >
          <i className="bi bi-list fs-5" aria-hidden="true" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          className="ef-hamburger d-none d-md-flex"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-layout-sidebar-inset fs-5" aria-hidden="true" />
        </button>

        {/* Brand */}
        <Link className="ef-topbar-brand" to={ROUTES.HOME} aria-label="ExpenseFlow home">
          <div className="brand-icon" aria-hidden="true">
            <i className="bi bi-receipt-cutoff" />
          </div>
          <span className="d-none d-sm-inline">ExpenseFlow</span>
        </Link>

        {/* Actions */}
        <div className="ef-topbar-actions">
          {/* Role badge */}
          <div className="ef-role-badge" title={`Viewing as: ${role}`}>
            <div
              className="role-dot"
              style={role === ROLES.FINANCE_MANAGER ? { background: '#6366F1' } : {}}
              aria-hidden="true"
            />
            <span className="d-none d-md-inline" style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
              {role}
            </span>
            <div
              style={{
                width: 24, height: 24, borderRadius: '50%',
                background: role === ROLES.FINANCE_MANAGER ? '#6366F1' : '#16A34A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '10px', fontWeight: 700, flexShrink: 0
              }}
              aria-hidden="true"
            >
              {roleInitial}
            </div>
          </div>

          {/* Switch role */}
          <button
            className="ef-switch-btn"
            onClick={handleRoleSwitch}
            aria-label={`Switch to ${otherRole}`}
          >
            <i className="bi bi-arrow-left-right" style={{ fontSize: 12 }} aria-hidden="true" />
            <span className="d-none d-sm-inline">Switch to {otherRole === ROLES.FINANCE_MANAGER ? 'Finance Mgr' : 'Employee'}</span>
            <span className="d-inline d-sm-none">Switch</span>
          </button>
        </div>
      </header>
    </>
  );
};
