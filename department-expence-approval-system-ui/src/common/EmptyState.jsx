export const EmptyState = ({ title = "No Data Found", description = "There are no records to display at this time.", icon = "bi-inbox" }) => (
  <div className="text-center py-5 bg-light rounded border border-light">
    <i className={`bi ${icon} text-muted mb-3`} style={{ fontSize: "3rem" }}></i>
    <h5 className="text-dark fw-semibold">{title}</h5>
    <p className="text-muted">{description}</p>
  </div>
);
