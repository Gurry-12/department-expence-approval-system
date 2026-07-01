export const SearchBar = ({ placeholder = "Search...", value, onChange }) => (
  <div className="input-group">
    <span className="input-group-text bg-white border-end-0 text-muted">
      <i className="bi bi-search"></i>
    </span>
    <input
      type="text"
      className="form-control border-start-0 ps-0"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
