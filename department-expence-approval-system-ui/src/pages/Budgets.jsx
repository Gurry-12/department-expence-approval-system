import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, AppButton, Pagination } from '../common';
import { BudgetFormModal } from '../components/budgets/BudgetFormModal';
import { BudgetDeleteDialog } from '../components/budgets/BudgetDeleteDialog';
import { budgetService } from '../services/budgetService';
import { departmentService } from '../services/departmentService';
import { formatCurrency } from '../utils/formatters';
import { MONTHS } from '../constants';

const formatMonth = (m) => {
  if (!m) return '-';
  const name = typeof m === 'number' ? MONTHS[m - 1] : m;
  return name ? name.charAt(0) + name.slice(1).toLowerCase() : m;
};

export const Budgets = () => {
  const [budgets, setBudgets]         = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy]           = useState('departmentName');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [isFormModalOpen, setIsFormModalOpen]       = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget]         = useState(null);

  const getDeptName = (budget) => budget.department?.departmentName || 'Unknown';

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgetsRes, deptsRes] = await Promise.all([
        budgetService.getAllBudgets(),
        departmentService.getAllDepartments(),
      ]);
      if (deptsRes?.success && Array.isArray(deptsRes.data))   setDepartments(deptsRes.data);
      if (budgetsRes?.success && Array.isArray(budgetsRes.data)) setBudgets(budgetsRes.data);
    } catch { /* handled globally */ }
    finally { setIsLoading(false); }
  }, []);

  const refreshBudgets = async () => {
    try {
      const res = await budgetService.getAllBudgets();
      if (res?.success && Array.isArray(res.data)) setBudgets(res.data);
    } catch { /* handled globally */ }
  };

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const processedData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let filtered = budgets.filter(b =>
      getDeptName(b).toLowerCase().includes(query) ||
      (b.month && b.month.toLowerCase().includes(query)) ||
      (b.year && b.year.toString().includes(query))
    );
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departmentName': return getDeptName(a).localeCompare(getDeptName(b));
        case 'month':         return (a.month || '').localeCompare(b.month || '');
        case 'year':          return (b.year || 0) - (a.year || 0);
        case 'budgetAmount':  return (b.budgetAmount || 0) - (a.budgetAmount || 0);
        default: return 0;
      }
    });
    return filtered;
  }, [budgets, searchQuery, sortBy]);

  const totalPages   = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage]);

  const handleOpenCreate = () => { setSelectedBudget(null); setIsFormModalOpen(true); };
  const handleOpenEdit   = (budget) => {
    setSelectedBudget({
      id: budget.id,
      departmentId: budget.department?.id || '',
      month: budget.month,
      year: budget.year,
      budgetAmount: budget.budgetAmount,
    });
    setIsFormModalOpen(true);
  };
  const handleOpenDelete = (budget) => {
    setSelectedBudget({ id: budget.id, detailText: `${getDeptName(budget)} — ${formatMonth(budget.month)} ${budget.year}` });
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    if (selectedBudget?.id) {
      const res = await budgetService.updateBudget(selectedBudget.id, payload);
      if (res.success) toast.success('Budget updated successfully');
    } else {
      const res = await budgetService.createBudget(payload);
      if (res.success) toast.success('Budget allocated successfully');
    }
    setIsFormModalOpen(false);
    refreshBudgets();
  };

  const handleDeleteConfirm = async () => {
    const res = await budgetService.deleteBudget(selectedBudget.id);
    if (res.success) toast.success('Budget deleted successfully');
    setIsDeleteDialogOpen(false);
    refreshBudgets();
  };

  const columns = [
    {
      header: '#',
      accessor: 'sno',
      render: (row) => currentPage * pageSize + paginatedData.indexOf(row) + 1,
    },
    { header: 'Department', accessor: 'department', render: (row) => getDeptName(row) },
    { header: 'Month', accessor: 'month', render: (row) => formatMonth(row.month) },
    { header: 'Year', accessor: 'year' },
    {
      header: 'Budget Amount',
      accessor: 'budgetAmount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#16A34A' }}>{formatCurrency(row.budgetAmount)}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
            aria-label={`Edit budget: ${getDeptName(row)} ${formatMonth(row.month)} ${row.year}`}
            title="Edit budget amount"
          >
            <i className="bi bi-pencil-square" aria-hidden="true" />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => { e.stopPropagation(); handleOpenDelete(row); }}
            aria-label={`Delete budget: ${getDeptName(row)} ${formatMonth(row.month)} ${row.year}`}
            title="Delete budget"
          >
            <i className="bi bi-trash3" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Department Budgets"
        subtitle="Manage monthly budget allocations per department"
        action={
          <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>Allocate Budget</AppButton>
        }
      />

      <AppCard>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3 align-items-md-center">
          <div style={{ maxWidth: 340, flex: 1 }}>
            <SearchBar
              placeholder="Search department, month, year…"
              value={searchQuery}
              onChange={(val) => { setSearchQuery(val); setCurrentPage(0); }}
            />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="budget-sort" className="text-muted" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by</label>
            <select
              id="budget-sort"
              className="form-select form-select-sm"
              style={{ minWidth: 180 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="departmentName">Department (A–Z)</option>
              <option value="month">Month (A–Z)</option>
              <option value="year">Year (Newest)</option>
              <option value="budgetAmount">Amount (Highest)</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          totalCount={processedData.length}
          currentPage={currentPage}
          pageSize={pageSize}
          emptyTitle="No Budgets Found"
          emptyMessage={searchQuery ? `No budgets match "${searchQuery}"` : 'Allocate your first budget to get started.'}
          emptyAction={
            !searchQuery && (
              <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
                <i className="bi bi-plus-lg me-1" /> Allocate Budget
              </button>
            )
          }
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </AppCard>

      {isFormModalOpen && (
        <BudgetFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          defaultValues={selectedBudget}
          departments={departments}
        />
      )}
      {isDeleteDialogOpen && (
        <BudgetDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          detailText={selectedBudget?.detailText}
        />
      )}
    </div>
  );
};
