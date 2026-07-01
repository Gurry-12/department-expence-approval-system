export const PageHeader = ({ title, subtitle, action }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2 className="mb-1 text-dark fw-bold">{title}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
