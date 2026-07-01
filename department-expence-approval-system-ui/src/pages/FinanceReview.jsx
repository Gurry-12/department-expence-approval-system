import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  PageHeader, AppCard, DataTable, SearchBar, 
  Pagination, StatusBadge 
} from '../common';
import { ReviewClaimModal } from '../components/reviews/ReviewClaimModal';
import { claimService } from '../services/claimService';
import { departmentService } from '../services/departmentService';
import { reviewService } from '../services/reviewService';
import { formatDate, formatCurrency } from '../utils/formatters';
import { CLAIM_STATUS, EXPENSE_CATEGORIES, MONTHS } from '../constants';

export const FinanceReview = () => {
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
    month: '',
    year: '',
    sortBy: 'createdAt',
    sortDir: 'asc' // Review oldest first by default
  });
  
  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
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

  const fetchPendingClaims = useCallback(async () => {
    setIsLoading(true);
    try {
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
        status: CLAIM_STATUS.PENDING, // Strictly enforce PENDING only
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
    fetchPendingClaims();
  }, [fetchPendingClaims]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // reset to first page
  };

  const handleOpenReview = (claim) => {
    setSelectedClaim(claim);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (payload) => {
    try {
      const res = await reviewService.reviewClaim(selectedClaim.id, payload);
      if (res.success) {
        toast.success(`Claim ${payload.recommendedStatus.toLowerCase()} successfully`);
        setIsReviewModalOpen(false);
        fetchPendingClaims(); // Refresh the list
      }
    } catch (error) {
      // Axios interceptor handles specific errors (e.g. Budget exceeded)
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
      render: (row) => (
        <button 
          className="btn btn-sm btn-primary" 
          onClick={(e) => { e.stopPropagation(); handleOpenReview(row); }}
        >
          Review
        </button>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Finance Review" 
        subtitle="Review and process pending expense claims" 
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

          <div className="col-md-3">
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

          <div className="col-md-3">
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
              <option value="createdAt-asc">Oldest First</option>
              <option value="createdAt-desc">Newest First</option>
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

      {/* Review Modal */}
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
