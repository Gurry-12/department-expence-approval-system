export const EmptyState = ({
  title = 'No Records Found',
  description = 'There are no records to display at this time.',
  icon = 'bi-inbox',
  action = null,
}) => (
  <div className="ef-empty">
    <div className="ef-empty-icon" aria-hidden="true">
      <i className={`bi ${icon}`} />
    </div>
    <h3 className="ef-empty-title">{title}</h3>
    <p className="ef-empty-msg">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
