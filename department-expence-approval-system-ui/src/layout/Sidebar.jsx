import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants';

export const Sidebar = ({ isOpen }) => {
  const navItems = [
    { label: 'Dashboard', path: ROUTES.HOME, icon: 'bi-grid-1x2-fill' },
    { label: 'Departments', path: ROUTES.DEPARTMENTS, icon: 'bi-building' },
    { label: 'Budgets', path: ROUTES.BUDGETS, icon: 'bi-piggy-bank' },
    { label: 'Expense Claims', path: ROUTES.CLAIMS, icon: 'bi-receipt' },
    { label: 'Finance Review', path: ROUTES.REVIEWS, icon: 'bi-check-circle' },
    { label: 'Finance Summary', path: ROUTES.FINANCE_SUMMARY, icon: 'bi-graph-up' },
  ];

  return (
    <div className={`sidebar bg-dark text-white shadow-sm ${isOpen ? 'show' : ''}`} style={{ width: '260px', minHeight: 'calc(100vh - 72px)', transition: 'all 0.3s' }}>
      <div className="p-3">
        <ul className="nav flex-column gap-2 mt-3">
          {navItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `nav-link text-white rounded-3 px-3 py-2 d-flex align-items-center ${isActive ? 'bg-primary fw-semibold' : 'opacity-75 hover-opacity-100'}`
                }
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
