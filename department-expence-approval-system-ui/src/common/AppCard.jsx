export const AppCard = ({ title, children, action, className = '' }) => (
  <div className={`card glass-card rounded-3 ${className}`}>
    {(title || action) && (
      <div className="card-header bg-transparent border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
        {title && <h5 className="card-title fw-bold mb-0 text-dark">{title}</h5>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="card-body">
      {children}
    </div>
  </div>
);
