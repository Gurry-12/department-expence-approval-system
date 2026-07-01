import { Link } from 'react-router-dom';
import { PageHeader, AppCard } from '../common';
import { ROUTES } from '../constants';

export const Dashboard = () => {
  const cards = [
    { title: 'Departments', icon: 'bi-building', link: ROUTES.DEPARTMENTS, color: 'text-primary' },
    { title: 'Budgets', icon: 'bi-piggy-bank', link: ROUTES.BUDGETS, color: 'text-success' },
    { title: 'Expense Claims', icon: 'bi-receipt', link: ROUTES.CLAIMS, color: 'text-warning' },
    { title: 'Finance Review', icon: 'bi-check-circle', link: ROUTES.REVIEWS, color: 'text-info' },
    { title: 'Finance Summary', icon: 'bi-graph-up', link: ROUTES.FINANCE_SUMMARY, color: 'text-danger' },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to the Department Expense Approval System"
      />
      <div className="row g-4 mt-2">
        {cards.map((card, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <Link to={card.link} className="text-decoration-none">
              <AppCard className="h-100 hover-shadow transition-all">
                <div className="d-flex align-items-center">
                  <div className={`p-3 bg-light rounded-circle me-4 ${card.color}`}>
                    <i className={`bi ${card.icon} fs-2`}></i>
                  </div>
                  <div>
                    <h5 className="mb-0 text-dark fw-bold">{card.title}</h5>
                    <small className="text-muted">Manage {card.title.toLowerCase()}</small>
                  </div>
                </div>
              </AppCard>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
