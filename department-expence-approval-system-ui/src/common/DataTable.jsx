import { EmptyState } from './EmptyState';

// Skeleton loader for table rows
const TableSkeleton = ({ columns, rows = 5 }) => (
  <>
    {[...Array(rows)].map((_, ri) => (
      <tr key={ri}>
        {columns.map((_, ci) => (
          <td key={ci} style={{ padding: '14px 16px' }}>
            <div
              className="ef-skeleton ef-skeleton-text"
              style={{ width: ci === 0 ? '30%' : ci % 3 === 0 ? '60%' : '80%' }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const DataTable = ({
  columns,
  data,
  isLoading,
  onRowClick,
  totalCount,
  currentPage = 0,
  pageSize = 10,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  emptyAction,
}) => {
  const showEmpty = !isLoading && (!data || data.length === 0);

  // Results info
  const startRow = totalCount ? currentPage * pageSize + 1 : null;
  const endRow   = totalCount ? Math.min((currentPage + 1) * pageSize, totalCount) : null;

  return (
    <>
      {totalCount != null && !isLoading && data?.length > 0 && (
        <div
          style={{
            fontSize: 12, color: '#64748B', padding: '0 4px 10px',
            fontWeight: 500
          }}
          aria-live="polite"
        >
          Showing {startRow}–{endRow} of <strong>{totalCount}</strong> records
        </div>
      )}

      <div className="table-responsive bg-white rounded" style={{ border: '1px solid #E2E8F0', borderRadius: 12 }}>
        <table
          className="table table-hover mb-0 align-middle"
          aria-label="Data table"
          aria-busy={isLoading}
        >
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} scope="col">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton columns={columns} rows={5} />
            ) : showEmpty ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 0, border: 'none' }}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyMessage}
                    icon={emptyIcon}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
