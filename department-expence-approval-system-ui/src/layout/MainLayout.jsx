import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar, MobileSidebar } from './Sidebar';
import { Footer } from './Footer';
import { ROUTES } from '../constants';

const ROUTE_LABELS = {
  [ROUTES.HOME]:           'Dashboard',
  [ROUTES.DEPARTMENTS]:    'Departments',
  [ROUTES.BUDGETS]:        'Department Budgets',
  [ROUTES.CLAIMS]:         'Expense Claims',
  [ROUTES.REVIEWS]:        'Finance Review',
  [ROUTES.FINANCE_SUMMARY]:'Finance Summary',
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const label = ROUTE_LABELS[pathname];
  if (pathname === ROUTES.HOME || !label) return null;

  return (
    <div className="ef-breadcrumb-bar">
      <ol className="ef-breadcrumb">
        <li>
          <Link to={ROUTES.HOME}>Dashboard</Link>
        </li>
        <li aria-hidden="true"><span className="ef-breadcrumb-sep">›</span></li>
        <li aria-current="page">{label}</li>
      </ol>
    </div>
  );
};

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="ef-layout">
      <Navbar
        toggleSidebar={() => setIsSidebarCollapsed(p => !p)}
        onMobileOpen={() => setIsMobileOpen(true)}
      />

      <div className="ef-body">
        {/* Desktop sidebar */}
        <div className="d-none d-md-block">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onClose={undefined}
          />
        </div>

        {/* Mobile offcanvas */}
        <MobileSidebar
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
        />

        {/* Main */}
        <main className="ef-main" id="main-content" tabIndex={-1}>
          <Breadcrumb />
          <div className="ef-content">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
