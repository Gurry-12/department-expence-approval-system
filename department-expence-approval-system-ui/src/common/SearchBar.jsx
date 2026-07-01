export const SearchBar = ({ placeholder = 'Search...', value, onChange, id }) => (
  <div className="input-group">
    <span className="input-group-text bg-white border-end-0 text-muted" aria-hidden="true">
      <i className="bi bi-search" style={{ fontSize: 13 }} />
    </span>
    <input
      id={id}
      type="search"
      className="form-control border-start-0 ps-0"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    />
    {value && (
      <button
        type="button"
        className="btn btn-outline-secondary border-start-0"
        style={{ borderLeft: 'none', fontSize: 11, padding: '0 10px' }}
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        <i className="bi bi-x-lg" />
      </button>
    )}
  </div>
);
