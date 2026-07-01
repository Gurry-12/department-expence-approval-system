import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, Pagination, StatusBadge } from '../common';
import { ReviewClaimModal } from '../components/reviews/ReviewClaimModal';
import { claimService } from '../services/claimService';
import { departmentService } from '../services/departmentService';
import { reviewService } from '../services/reviewService';
import { formatDate, formatCurrency, formatEnum } from '../utils/formatters';
import { CLAIM_STATUS, EXPENSE_CATEGORIES, MONTHS } from '../constants';

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const DaysPendingBadge = ({ submittedAt }) => {
  const days = submittedAt
    // eslint-disable-next-line react-hooks/purity
    ? Math.floor((Date.now() - new Date(submittedAt).getTime()) / 86_400_000)
    : null;

  if (days === null) return null;

  const cls = days >= 7 ? 'urgent' : days >= 3 ? 'aging' : 'fresh';
  const icon = days >= 7 ? 'bi-exclamation-circle-fill' : days >= 3 ? 'bi-clock' : 'bi-check2-circle';

  return (
    <span className={`ef-days-badge ${cls}`}>
      <i className={`bi ${icon}`} aria-hidden="true" />
      {days}d
    </span>
  );
};

const FilterSelect = ({ id, label, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="ef-filter-label">{label}</label>
    <select id={id} className="form-select form-select-sm" value={value} onChange={e => onChange(e.target.value)}>
      {children}
    </select>
  </div>
);

export const FinanceReview = () => {
  const [claims, setClaims]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [totalElements, setTotalElements] = useState(null);
  const pageSize = 10;

  const defaultFilters = {
    employeeName: '', departmentId: '', expenseCategory: '', month: '', year: '',
    sortBy: 'createdAt', sortDir: 'asc',
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim]         = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const deptsRes = await departmentService.getAllDepartments();
      if (deptsRes?.success && Array.isArray(deptsRes.data)) setDepartments(deptsRes.data);
    } catch { /* handled globally */ }
  }, []);

  const fetchPendingClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthInt = filters.month ? MONTHS.indexOf(filters.month) + 1 : '';
      const params = {
        page: currentPage, size: pageSize,
        sortBy: filters.sortBy, sortDir: filters.sortDir,
        employeeName: filters.employeeName,
        departmentId: filters.departmentId,
        expenseCategory: filters.expenseCategory,
        status: CLAIM_STATUS.PENDING,
        month: monthInt,
        year: filters.year,
      };
      const res = await claimService.getAllClaims(params);
      if (res?.success && res.data) {
        setClaims(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements ?? null);
      }
    } finally { setIsLoading(false); }
  }, [currentPage, filters]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPendingClaims(); }, [fetchPendingClaims]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    !['sortBy','sortDir'].includes(k) && v !== ''
  );

  const clearAllFilters = () => { setFilters(defaultFilters); setCurrentPage(0); };

  const handleOpenReview = (claim) => { setSelectedClaim(claim); setIsReviewModalOpen(true); };

  const handleReviewSubmit = async (payload) => {
    const res = await reviewService.reviewClaim(selectedClaim.id, payload);
    if (res.success) {
      toast.success(`Claim ${payload.recommendedStatus.toLowerCase()} successfully`);
      setIsReviewModalOpen(false);
      fetchPendingClaims();
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.employeeName}</span>,
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Category', accessor: 'expenseCategory', render: (row) => formatEnum(row.expenseCategory) },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span style={{ fontWeight: 700, color: '#1E293B' }}>{formatCurrency(row.amount)}</span>,
    },
    { header: 'Date', accessor: 'expenseDate', render: (row) => formatDate(row.expenseDate) },
    {
      header: 'Age',
      accessor: 'createdAt',
      render: (row) => <DaysPendingBadge submittedAt={row.createdAt} />,
    },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Action',
      accessor: 'actions',
      render: (row) => (
        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
          onClick={(e) => { e.stopPropagation(); handleOpenReview(row); }}
          aria-label={`Review claim by ${row.employeeName}`}
        >
          <i className="bi bi-clipboard2-check" aria-hidden="true" />
          Review
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Finance Review"
        subtitle={
          totalElements !== null
            ? `${totalElements} pending claim${totalElements !== 1 ? 's' : ''} awaiting your review`
            : 'Review and process pending expense claims'
        }
      />

      {/* Filter Bar */}
      <div className="ef-filters-bar">
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <label className="ef-filter-label">Employee</label>
            <SearchBar
              placeholder="Search employee…"
              value={filters.employeeName}
              onChange={(val) => handleFilterChange('employeeName', val)}
            />
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="fr-dept" label="Department" value={filters.departmentId} onChange={v => handleFilterChange('departmentId', v)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="fr-cat" label="Category" value={filters.expenseCategory} onChange={v => handleFilterChange('expenseCategory', v)}>
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{formatEnum(cat)}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="fr-month" label="Month" value={filters.month} onChange={v => handleFilterChange('month', v)}>
              <option value="">All Months</option>
              {MONTHS.map(m => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-1">
            <FilterSelect id="fr-year" label="Year" value={filters.year} onChange={v => handleFilterChange('year', v)}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </FilterSelect>
          </div>
          <div className="col-12 col-md-2 d-flex align-items-end gap-2">
            <select
              id="fr-sort"
              className="form-select form-select-sm"
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => {
                const [by, dir] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy: by, sortDir: dir }));
                setCurrentPage(0);
              }}
              aria-label="Sort order"
            >
              <option value="createdAt-asc">Oldest First</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="amount-desc">Amount (High–Low)</option>
              <option value="employeeName-asc">Employee (A–Z)</option>
            </select>
            {hasActiveFilters && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearAllFilters}
                title="Clear all filters"
                aria-label="Clear all filters"
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className="bi bi-x-circle" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AppCard>
        <DataTable
          columns={columns}
          data={claims}
          isLoading={isLoading}
          totalCount={totalElements}
          currentPage={currentPage}
          pageSize={pageSize}
          emptyTitle="No Pending Claims"
          emptyMessage={hasActiveFilters ? 'No claims match the current filters.' : "You're all caught up! There are no pending claims to review."}
          emptyIcon="bi-check-circle"
          emptyAction={
            hasActiveFilters && (
              <button className="btn btn-sm btn-outline-secondary" onClick={clearAllFilters}>
                <i className="bi bi-x-circle me-1" />Clear Filters
              </button>
            )
          }
        />
        {totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </AppCard>

      {isReviewModalOpen && (
        <ReviewClaimModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          claim={selectedClaim}
        />
      )}
    </div>
  );
};
