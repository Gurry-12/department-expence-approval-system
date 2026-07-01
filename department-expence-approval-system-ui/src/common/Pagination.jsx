export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Smart ellipsis: always show first, last, current ± 2
  const getPages = () => {
    const delta = 2;
    const range = [];
    const left  = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    for (let i = left; i <= right; i++) range.push(i);

    if (left > 1) range.unshift('...');
    if (left > 0) range.unshift(0);
    if (right < totalPages - 2) range.push('...');
    if (right < totalPages - 1) range.push(totalPages - 1);

    // Deduplicate
    return range.filter((v, i, arr) => arr.indexOf(v) === i);
  };

  const pages = getPages();

  return (
    <nav
      className="d-flex justify-content-center mt-4"
      aria-label="Pagination"
    >
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <i className="bi bi-chevron-left" style={{ fontSize: 11 }} aria-hidden="true" />
          </button>
        </li>

        {pages.map((p, i) =>
          p === '...' ? (
            <li key={`ellipsis-${i}`} className="page-item disabled">
              <span className="page-link" aria-hidden="true">&hellip;</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p + 1}`}
                aria-current={currentPage === p ? 'page' : undefined}
              >
                {p + 1}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            <i className="bi bi-chevron-right" style={{ fontSize: 11 }} aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
