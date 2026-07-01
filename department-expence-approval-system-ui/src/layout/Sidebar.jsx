import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useRole, ROLES } from '../context';
import { claimService } from '../services/claimService';
import { CLAIM_STATUS } from '../constants';

export const Sidebar = ({ isCollapsed, onClose }) => {
  const { role } = useRole();
  const [pendingCount, setPendingCount] = useState(null);

  const isFinanceManager = role === ROLES.FINANCE_MANAGER;
  const roleInitials = isFinanceManager ? 'FM' : 'E';
  const roleColor = isFinanceManager ? '#6366F1' : '#16A34A';

  // Fetch pending claim count for Finance Manager
  useEffect(() => {
    if (!isFinanceManager) { setPendingCount(null); return; }
    const fetchCount = async () => {
      try {
        const res = await claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.PENDING });
        if (res?.success && res.data) {
          setPendingCount(res.data.totalElements ?? res.data.content?.length ?? null);
        }
      } catch {
        // silently ignore
      }
    };
    fetchCount();
  }, [isFinanceManager]);

  const allNavItems = [
    {
      label: 'Dashboard',
      path: ROUTES.HOME,
      icon: 'bi-speedometer2',
      roles: [ROLES.EMPLOYEE, ROLES.FINANCE_MANAGER],
      exact: true,
    },
    {
      label: 'Departments',
      path: ROUTES.DEPARTMENTS,
      icon: 'bi-building-fill',
      roles: [ROLES.FINANCE_MANAGER],
    },
    {
      label: 'Budgets',
      path: ROUTES.BUDGETS,
      icon: 'bi-wallet2',
      roles: [ROLES.FINANCE_MANAGER],
    },
    {
      label: 'Expense Claims',
      path: ROUTES.CLAIMS,
      icon: 'bi-receipt-cutoff',
      roles: [ROLES.EMPLOYEE, ROLES.FINANCE_MANAGER],
    },
    {
      label: 'Finance Review',
      path: ROUTES.REVIEWS,
      icon: 'bi-clipboard2-check-fill',
      roles: [ROLES.FINANCE_MANAGER],
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      label: 'Finance Summary',
      path: ROUTES.FINANCE_SUMMARY,
      icon: 'bi-bar-chart-fill',
      roles: [ROLES.FINANCE_MANAGER],
    },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const NavContent = () => (
    <div className="ef-sidebar-inner">
      {/* Role section */}
      <div className="ef-sidebar-role">
        <div
          className="role-avatar"
          style={{ background: roleColor }}
          title={role}
          aria-hidden="true"
        >
          {roleInitials}
        </div>
        <div className="role-info">
          <div className="role-name">{role}</div>
          <div className="role-title">Active Session</div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="ef-sidebar-nav" aria-label="Main navigation">
        <div className="ef-sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `ef-nav-item${isActive ? ' active' : ''}`
            }
            aria-current={({ isActive }) => isActive ? 'page' : undefined}
            title={isCollapsed ? item.label : undefined}
          >
            <i className={`bi ${item.icon} nav-icon`} aria-hidden="true" />
            <span className="nav-label">{item.label}</span>
            {item.badge != null && (
              <span className="nav-badge" aria-label={`${item.badge} pending`}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom toggle (desktop only) */}
      <div className="ef-sidebar-toggle">
        <span className="toggle-label" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isCollapsed ? '' : 'Collapse'}
        </span>
      </div>
    </div>
  );

  return <div className={`ef-sidebar${isCollapsed ? ' collapsed' : ''}`} aria-label="Sidebar"><NavContent /></div>;
};

// Mobile offcanvas sidebar
export const MobileSidebar = ({ isOpen, onClose }) => {
  const { role } = useRole();
  const [pendingCount, setPendingCount] = useState(null);
  const isFinanceManager = role === ROLES.FINANCE_MANAGER;
  const roleColor = isFinanceManager ? '#6366F1' : '#16A34A';

  useEffect(() => {
    if (!isFinanceManager) { setPendingCount(null); return; }
    const fetchCount = async () => {
      try {
        const res = await claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.PENDING });
        if (res?.success && res.data) {
          setPendingCount(res.data.totalElements ?? null);
        }
      } catch { /* ignore */ }
    };
    fetchCount();
  }, [isFinanceManager]);

  const allNavItems = [
    { label: 'Dashboard', path: ROUTES.HOME, icon: 'bi-speedometer2', roles: [ROLES.EMPLOYEE, ROLES.FINANCE_MANAGER], exact: true },
    { label: 'Departments', path: ROUTES.DEPARTMENTS, icon: 'bi-building-fill', roles: [ROLES.FINANCE_MANAGER] },
    { label: 'Budgets', path: ROUTES.BUDGETS, icon: 'bi-wallet2', roles: [ROLES.FINANCE_MANAGER] },
    { label: 'Expense Claims', path: ROUTES.CLAIMS, icon: 'bi-receipt-cutoff', roles: [ROLES.EMPLOYEE, ROLES.FINANCE_MANAGER] },
    { label: 'Finance Review', path: ROUTES.REVIEWS, icon: 'bi-clipboard2-check-fill', roles: [ROLES.FINANCE_MANAGER], badge: pendingCount > 0 ? pendingCount : null },
    { label: 'Finance Summary', path: ROUTES.FINANCE_SUMMARY, icon: 'bi-bar-chart-fill', roles: [ROLES.FINANCE_MANAGER] },
  ];
  const navItems = allNavItems.filter(item => item.roles.includes(role));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1040, backdropFilter: 'blur(2px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 260, background: '#0F172A',
          zIndex: 1045, display: 'flex', flexDirection: 'column',
          animation: 'ef-slide-in 0.22s ease'
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <style>{`@keyframes ef-slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>ExpenseFlow</span>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            aria-label="Close navigation"
          >
            <i className="bi bi-x-lg" style={{ fontSize: 14 }} />
          </button>
        </div>
        {/* Role */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>
            {isFinanceManager ? 'FM' : 'E'}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{role}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Active Session</div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) => `ef-nav-item${isActive ? ' active' : ''}`}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <i className={`bi ${item.icon} nav-icon`} />
              <span className="nav-label">{item.label}</span>
              {item.badge != null && (
                <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};
