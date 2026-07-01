import { EmptyState } from './EmptyState';
import { PageLoader } from './PageLoader';

export const DataTable = ({ columns, data, isLoading, onRowClick }) => {
  if (isLoading) return <PageLoader />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <div className="table-responsive bg-white rounded shadow-sm">
      <table className="table table-hover mb-0 align-middle">
        <thead className="table-light text-secondary">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="fw-semibold py-3 px-4 border-bottom-0">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border-top-0">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-3 px-4 border-bottom text-dark">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
