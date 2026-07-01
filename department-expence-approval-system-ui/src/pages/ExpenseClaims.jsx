import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  PageHeader, AppCard, DataTable, SearchBar, 
  AppButton, Pagination, StatusBadge 
} from '../common';
import { ExpenseClaimFormModal } from '../components/claims/ExpenseClaimFormModal';
import { ExpenseClaimDeleteDialog } from '../components/claims/ExpenseClaimDeleteDialog';
import { claimService } from '../services/claimService';
import { departmentService } from '../services/departmentService';
import { formatDate, formatCurrency } from '../utils/formatters';
import { CLAIM_STATUS, EXPENSE_CATEGORIES, MONTHS } from '../constants';

export const ExpenseClaims = () => {
  const [claims, setClaims] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Server-side Pagination & Filters
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  
  const [filters, setFilters] = useState({
    employeeName: '',
    departmentId: '',
    expenseCategory: '',
    status: '',
    month: '',
    year: '',
    sortBy: 'createdAt',
    sortDir: 'desc'
  });
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const deptsRes = await departmentService.getAllDepartments();
      if (deptsRes?.success && Array.isArray(deptsRes.data)) {
        setDepartments(deptsRes.data);
      }
    } catch (error) {
      // Handled globally
    }
  }, []);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      // The backend expects 1-based month integer or the string?
      // Wait, contract says `month` (Integer), but Budgets API used String (Enum) for payload.
      // Contract says: "month (Integer)" for GET /api/claims.
      // Let's pass the index + 1 for month if it's selected.
      let monthInt = '';
      if (filters.month) {
        monthInt = MONTHS.indexOf(filters.month) + 1;
      }

      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        employeeName: filters.employeeName,
        departmentId: filters.departmentId,
        expenseCategory: filters.expenseCategory,
        status: filters.status,
        month: monthInt,
        year: filters.year
      };

      const res = await claimService.getAllClaims(params);
      if (res?.success && res.data) {
        setClaims(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // reset to first page on filter change
  };

  const handleOpenCreate = () => {
    setSelectedClaim(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (claim) => {
    // We need to map the department string back to departmentId for the form.
    const deptObj = departments.find(d => d.departmentName === claim.department);
    
    setSelectedClaim({
      id: claim.id,
      employeeName: claim.employeeName,
      departmentId: deptObj ? deptObj.id : '',
      expenseCategory: claim.expenseCategory,
      amount: claim.amount,
      expenseDate: claim.expenseDate,
      description: claim.description
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (claim) => {
    setSelectedClaim({
      id: claim.id,
      detailText: `${claim.employeeName} - ${formatCurrency(claim.amount)}`
    });
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedClaim?.id) {
        const res = await claimService.updateClaim(selectedClaim.id, payload);
        if(res.success) toast.success('Claim updated successfully');
      } else {
        const res = await claimService.createClaim(payload);
        if(res.success) toast.success('Claim submitted successfully');
      }
      setIsFormModalOpen(false);
      fetchClaims();
    } catch (error) {
      throw error; 
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await claimService.deleteClaim(selectedClaim.id);
      if(res.success) toast.success('Claim deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchClaims();
    } catch (error) {
       throw error;
    }
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Category', accessor: 'expenseCategory' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="fw-semibold">{formatCurrency(row.amount)}</span>
    },
    { 
      header: 'Date', 
      accessor: 'expenseDate',
      render: (row) => formatDate(row.expenseDate)
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => {
        // Business Rule: Only PENDING claims can be edited or deleted
        const isPending = row.status === CLAIM_STATUS.PENDING;
        if (!isPending) return <span className="text-muted small">Read Only</span>;

        return (
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
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Expense Claims" 
        subtitle="Submit and track your expense claims" 
        action={
          <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>
            Submit Claim
          </AppButton>
        }
      />
      
      <AppCard>
        {/* Filters Section */}
        <div className="row g-3 mb-4 bg-light p-3 rounded">
          <div className="col-md-3">
            <label className="form-label small text-muted mb-1">Employee Search</label>
            <SearchBar 
              placeholder="Search employee..." 
              value={filters.employeeName} 
              onChange={(val) => handleFilterChange('employeeName', val)} 
            />
          </div>
          
          <div className="col-md-3">
            <label className="form-label small text-muted mb-1">Department</label>
            <select 
              className="form-select" 
              value={filters.departmentId} 
              onChange={(e) => handleFilterChange('departmentId', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.departmentName}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small text-muted mb-1">Category</label>
            <select 
              className="form-select" 
              value={filters.expenseCategory} 
              onChange={(e) => handleFilterChange('expenseCategory', e.target.value)}
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small text-muted mb-1">Status</label>
            <select 
              className="form-select" 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.values(CLAIM_STATUS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small text-muted mb-1">Sort By</label>
            <select 
              className="form-select" 
              value={`${filters.sortBy}-${filters.sortDir}`} 
              onChange={(e) => {
                const [by, dir] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy: by, sortDir: dir }));
                setCurrentPage(0);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="expenseDate-desc">Expense Date (New-Old)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="employeeName-asc">Employee (A-Z)</option>
            </select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={claims} 
          isLoading={isLoading} 
        />
        
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
      </AppCard>

      {/* Modals */}
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
