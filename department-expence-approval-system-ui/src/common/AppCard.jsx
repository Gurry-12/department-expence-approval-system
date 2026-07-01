export const AppCard = ({ title, children, action, className = '', style }) => (
  <div className={`card ${className}`} style={style}>
    {(title || action) && (
      <div
        className="card-header bg-transparent d-flex justify-content-between align-items-center"
        style={{ padding: '16px 24px 0', borderBottom: 'none' }}
      >
        {title && <h5 style={{ fontWeight: 700, margin: 0, fontSize: 15, color: '#1E293B' }}>{title}</h5>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="card-body">{children}</div>
  </div>
);
