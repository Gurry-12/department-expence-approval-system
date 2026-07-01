import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export const Navbar = ({ toggleSidebar }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3 sticky-top">
    <div className="d-flex align-items-center">
      <button className="btn btn-light d-md-none me-3" onClick={toggleSidebar}>
        <i className="bi bi-list fs-4"></i>
      </button>
      <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to={ROUTES.HOME}>
        <i className="bi bi-wallet2 me-2"></i>
        <span>ExpenseFlow</span>
      </Link>
    </div>
    <div className="ms-auto d-flex align-items-center">
      <div className="dropdown">
        <button className="btn btn-light rounded-circle p-2" type="button" data-bs-toggle="dropdown">
          <i className="bi bi-person-circle fs-5 text-secondary"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
          <li><span className="dropdown-item-text fw-bold">Admin User</span></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button className="dropdown-item text-danger">Logout</button></li>
        </ul>
      </div>
    </div>
  </nav>
);
