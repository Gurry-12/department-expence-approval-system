import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, AppButton, Pagination } from '../common';
import { BudgetFormModal } from '../components/budgets/BudgetFormModal';
import { BudgetDeleteDialog } from '../components/budgets/BudgetDeleteDialog';
import { budgetService } from '../services/budgetService';
import { departmentService } from '../services/departmentService';
import { formatDate, formatCurrency } from '../utils/formatters';
import { MONTHS } from '../constants';

export const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('departmentName'); 
  
  // Pagination (Frontend)
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgetsRes, deptsRes] = await Promise.all([
        budgetService.getAllBudgets(),
        departmentService.getAllDepartments()
      ]);
      
      if (deptsRes?.success && Array.isArray(deptsRes.data)) {
        setDepartments(deptsRes.data);
      }
      if (budgetsRes?.success && Array.isArray(budgetsRes.data)) {
        setBudgets(budgetsRes.data);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBudgets = async () => {
    try {
      const res = await budgetService.getAllBudgets();
      if (res?.success && Array.isArray(res.data)) {
        setBudgets(res.data);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
       // Handled globally
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInitialData();
  }, [fetchInitialData]);

  // Helper to get nested department name
  const getDeptName = (budget) => budget.department?.departmentName || 'Unknown';

  // Handle Search and Sort
  const processedData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let filtered = budgets.filter(b => 
      getDeptName(b).toLowerCase().includes(query) ||
      (b.month && b.month.toLowerCase().includes(query)) ||
      (b.year && b.year.toString().includes(query))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departmentName':
          return getDeptName(a).localeCompare(getDeptName(b));
        case 'month':
          return (a.month || '').localeCompare(b.month || '');
        case 'year':
          return (b.year || 0) - (a.year || 0); // Newest year first
        case 'budgetAmount':
          return (b.budgetAmount || 0) - (a.budgetAmount || 0); // Highest budget first
        default:
          return 0;
      }
    });

    return filtered;
  }, [budgets, searchQuery, sortBy]);

  // Handle Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedBudget(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    // Map existing budget to form defaultValues
    setSelectedBudget({
      id: budget.id,
      departmentId: budget.department?.id || '',
      month: budget.month,
      year: budget.year,
      budgetAmount: budget.budgetAmount
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (budget) => {
    setSelectedBudget({
      id: budget.id,
      detailText: `${getDeptName(budget)} - ${budget.month} ${budget.year}`
    });
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (payload) => {
      if (selectedBudget?.id) {
        // Update should only allow editing Budget Amount per backend rules
        const res = await budgetService.updateBudget(selectedBudget.id, payload);
        if(res.success) toast.success('Budget updated successfully');
      } else {
        const res = await budgetService.createBudget(payload);
        if(res.success) toast.success('Budget allocated successfully');
      }
      setIsFormModalOpen(false);
      refreshBudgets();
  };

  const handleDeleteConfirm = async () => {
      const res = await budgetService.deleteBudget(selectedBudget.id);
      if(res.success) toast.success('Budget deleted successfully');
      setIsDeleteDialogOpen(false);
      refreshBudgets();
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'sno',
      render: (row) => processedData.indexOf(row) + 1
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => getDeptName(row)
    },
    {
      header: 'Month',
      accessor: 'month',
      render: (row) => typeof row.month === 'number' ? MONTHS[row.month - 1] : row.month
    },
    {
      header: 'Year',
      accessor: 'year'
    },
    {
      header: 'Amount',
      accessor: 'budgetAmount',
      render: (row) => <span className="fw-semibold text-success">{formatCurrency(row.budgetAmount)}</span>
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      render: (row) => formatDate(row.updatedAt)
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={(e) => { e.stopPropagation(); handleOpenDelete(row); }}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Department Budgets" 
        subtitle="Manage monthly budget allocations" 
        action={
          <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>
            Allocate Budget
          </AppButton>
        }
      />
      
      <AppCard>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <SearchBar 
              placeholder="Search department, month, or year..." 
              value={searchQuery} 
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(0);
              }} 
            />
          </div>
          <div>
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="departmentName">Sort by Department (A-Z)</option>
              <option value="month">Sort by Month (A-Z)</option>
              <option value="year">Sort by Year (Newest)</option>
              <option value="budgetAmount">Sort by Amount (Highest)</option>
            </select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={paginatedData} 
          isLoading={isLoading} 
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </AppCard>

      {/* Modals */}
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
