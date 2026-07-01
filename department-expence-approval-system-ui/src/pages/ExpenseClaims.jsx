import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, AppButton, Pagination, StatusBadge } from '../common';
import { ExpenseClaimFormModal } from '../components/claims/ExpenseClaimFormModal';
import { ExpenseClaimDeleteDialog } from '../components/claims/ExpenseClaimDeleteDialog';
import { claimService } from '../services/claimService';
import { departmentService } from '../services/departmentService';
import { formatDate, formatCurrency, formatEnum } from '../utils/formatters';
import { CLAIM_STATUS, EXPENSE_CATEGORIES, MONTHS } from '../constants';
import { useRole, ROLES } from '../context';

const FilterSelect = ({ id, label, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="ef-filter-label">{label}</label>
    <select id={id} className="form-select form-select-sm" value={value} onChange={e => onChange(e.target.value)}>
      {children}
    </select>
  </div>
);

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export const ExpenseClaims = () => {
  const { role } = useRole();
  const isEmployee = role === ROLES.EMPLOYEE;

  const [claims, setClaims]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [totalElements, setTotalElements] = useState(null);
  const size = 10;

  const defaultFilters = {
    employeeName: '', departmentId: '', expenseCategory: '',
    status: '', month: '', year: '',
    sortBy: 'createdAt', sortDir: 'desc',
  };
  const [filters, setFilters] = useState(defaultFilters);

  const [isFormModalOpen, setIsFormModalOpen]       = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim]           = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const deptsRes = await departmentService.getAllDepartments();
      if (deptsRes?.success && Array.isArray(deptsRes.data)) setDepartments(deptsRes.data);
    } catch { /* handled globally */ }
  }, []);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthInt = filters.month ? MONTHS.indexOf(filters.month) + 1 : '';
      const params = {
        page: currentPage, size,
        sortBy: filters.sortBy, sortDir: filters.sortDir,
        employeeName: filters.employeeName,
        departmentId: filters.departmentId,
        expenseCategory: filters.expenseCategory,
        status: filters.status,
        month: monthInt,
        year: filters.year,
      };
      const res = await claimService.getAllClaims(params);
      if (res?.success && res.data) {
        setClaims(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements ?? null);
      }
    } catch { /* handled globally */ }
    finally { setIsLoading(false); }
  }, [currentPage, filters]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);
  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    !['sortBy','sortDir'].includes(k) && v !== ''
  );

  const clearAllFilters = () => { setFilters(defaultFilters); setCurrentPage(0); };

  const handleOpenCreate = () => { setSelectedClaim(null); setIsFormModalOpen(true); };
  const handleOpenEdit   = (claim) => {
    const deptObj = departments.find(d => d.departmentName === claim.department);
    setSelectedClaim({
      id: claim.id,
      employeeName: claim.employeeName,
      departmentId: deptObj ? deptObj.id : '',
      expenseCategory: claim.expenseCategory,
      amount: claim.amount,
      expenseDate: claim.expenseDate,
      description: claim.description,
    });
    setIsFormModalOpen(true);
  };
  const handleOpenDelete = (claim) => {
    setSelectedClaim({ id: claim.id, detailText: `${claim.employeeName} — ${formatCurrency(claim.amount)}` });
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedClaim?.id) {
        const res = await claimService.updateClaim(selectedClaim.id, payload);
        if (res.success) toast.success('Claim updated successfully');
      } else {
        const res = await claimService.createClaim(payload);
        if (res.success) toast.success('Claim submitted successfully');
      }
      setIsFormModalOpen(false);
      fetchClaims();
    } catch (error) { throw error; }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await claimService.deleteClaim(selectedClaim.id);
      if (res.success) toast.success('Claim deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchClaims();
    } catch (error) { throw error; }
  };

  const baseColumns = [
    { header: 'Employee', accessor: 'employeeName', render: (row) => <span style={{ fontWeight: 600 }}>{row.employeeName}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Category', accessor: 'expenseCategory', render: (row) => formatEnum(row.expenseCategory) },
    { header: 'Amount', accessor: 'amount', render: (row) => <span style={{ fontWeight: 700, color: '#1E293B' }}>{formatCurrency(row.amount)}</span> },
    { header: 'Date', accessor: 'expenseDate', render: (row) => formatDate(row.expenseDate) },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const columns = isEmployee ? [
    ...baseColumns,
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => {
        const isPending = row.status === CLAIM_STATUS.PENDING;
        if (!isPending) return (
          <span title="Only pending claims can be edited or deleted" aria-label="Read only">
            <i className="bi bi-lock" style={{ color: '#CBD5E1', fontSize: 14 }} aria-hidden="true" />
          </span>
        );
        return (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
              aria-label={`Edit claim by ${row.employeeName}`}
              title="Edit claim"
            >
              <i className="bi bi-pencil-square" aria-hidden="true" />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => { e.stopPropagation(); handleOpenDelete(row); }}
              aria-label={`Delete claim by ${row.employeeName}`}
              title="Delete claim"
            >
              <i className="bi bi-trash3" aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ] : baseColumns;

  return (
    <div>
      <PageHeader
        title="Expense Claims"
        subtitle={isEmployee ? 'Submit and track your expense claims' : 'Monitor all department expense claims'}
        action={
          isEmployee && (
            <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>Submit Claim</AppButton>
          )
        }
      />

      {/* Filter Bar */}
      <div className="ef-filters-bar">
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <label className="ef-filter-label">Employee Name</label>
            <SearchBar
              placeholder="Search employee…"
              value={filters.employeeName}
              onChange={(val) => handleFilterChange('employeeName', val)}
            />
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="filter-dept" label="Department" value={filters.departmentId} onChange={(v) => handleFilterChange('departmentId', v)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="filter-cat" label="Category" value={filters.expenseCategory} onChange={(v) => handleFilterChange('expenseCategory', v)}>
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{formatEnum(cat)}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-2">
            <FilterSelect id="filter-status" label="Status" value={filters.status} onChange={(v) => handleFilterChange('status', v)}>
              <option value="">All Statuses</option>
              {Object.values(CLAIM_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-1">
            <FilterSelect id="filter-month" label="Month" value={filters.month} onChange={(v) => handleFilterChange('month', v)}>
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-1">
            <FilterSelect id="filter-year" label="Year" value={filters.year} onChange={(v) => handleFilterChange('year', v)}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </FilterSelect>
          </div>
          <div className="col-6 col-md-1 d-flex align-items-end">
            {hasActiveFilters && (
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={clearAllFilters}
                title="Clear all filters"
                aria-label="Clear all filters"
              >
                <i className="bi bi-x-circle me-1" aria-hidden="true" />Clear
              </button>
            )}
          </div>
        </div>

        {/* Sort row */}
        <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
          <label htmlFor="claims-sort" className="text-muted" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by</label>
          <select
            id="claims-sort"
            className="form-select form-select-sm"
            style={{ maxWidth: 200 }}
            value={`${filters.sortBy}-${filters.sortDir}`}
            onChange={(e) => {
              const [by, dir] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy: by, sortDir: dir }));
              setCurrentPage(0);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="expenseDate-desc">Expense Date (New–Old)</option>
            <option value="amount-desc">Amount (High–Low)</option>
            <option value="employeeName-asc">Employee (A–Z)</option>
          </select>
        </div>
      </div>

      <AppCard>
        <DataTable
          columns={columns}
          data={claims}
          isLoading={isLoading}
          totalCount={totalElements}
          currentPage={currentPage}
          pageSize={size}
          emptyTitle="No Expense Claims"
          emptyMessage="No claims match the current filters."
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

      {isFormModalOpen && (
        <ExpenseClaimFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          defaultValues={selectedClaim}
          departments={departments}
        />
      )}
      {isDeleteDialogOpen && (
        <ExpenseClaimDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          detailText={selectedClaim?.detailText}
        />
      )}
    </div>
  );
};
