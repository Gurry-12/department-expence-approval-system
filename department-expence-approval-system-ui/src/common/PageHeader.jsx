export const PageHeader = ({ title, subtitle, action }) => (
  <div className="ef-page-header">
    <div>
      <h1 className="ef-page-title">{title}</h1>
      {subtitle && <p className="ef-page-subtitle">{subtitle}</p>}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);
