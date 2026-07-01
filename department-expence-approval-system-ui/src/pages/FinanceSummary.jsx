import { useState, useEffect } from 'react';
import { PageHeader, AppCard, AppButton, PageLoader, EmptyState } from '../common';
import { departmentService } from '../services/departmentService';
import { financeSummaryService } from '../services/financeSummaryService';
import { formatCurrency } from '../utils/formatters';
import { MONTHS } from '../constants';

// Reusable metric card
const MetricCard = ({ title, value, icon, colorClass, isCurrency = false, className = '' }) => (
  <div className={`col-12 col-sm-6 col-lg-3 mb-4 ${className}`}>
    <AppCard className="h-100 border-0 shadow-sm">
      <div className="d-flex align-items-center">
        <div className={`flex-shrink-0 bg-${colorClass} bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
          <i className={`bi ${icon} fs-4 text-${colorClass}`}></i>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="text-muted mb-1 small text-uppercase fw-semibold">{title}</h6>
          <h3 className="mb-0 fw-bold">
            {isCurrency ? formatCurrency(value) : value}
          </h3>
        </div>
      </div>
    </AppCard>
  </div>
);

export const FinanceSummary = () => {
  const [departments, setDepartments] = useState([]);
  const [summary, setSummary] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    departmentId: '',
    month: '',
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    // Load departments for the dropdown
    const fetchDepts = async () => {
      try {
        const res = await departmentService.getAllDepartments();
        if (res?.success && Array.isArray(res.data)) {
          setDepartments(res.data);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Handled globally
      }
    };
    fetchDepts();
  }, []);

  const handleSearch = async () => {
    if (!filters.departmentId || !filters.month || !filters.year) return;
    
    setIsLoading(true);
    setSummary(null);
    try {
      const res = await financeSummaryService.getSummary(
        filters.departmentId, 
        filters.month, 
        filters.year
      );
      
      if (res?.success && res.data) {
        setSummary(res.data);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // 404 Budget Not Found etc handled globally by toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      departmentId: '',
      month: '',
      year: new Date().getFullYear().toString()
    });
    setSummary(null);
  };

  const isSearchDisabled = !filters.departmentId || !filters.month || !filters.year || isLoading;

  return (
    <div>
      <PageHeader 
        title="Finance Summary Dashboard" 
        subtitle="Real-time financial analytics and budget consumption" 
      />

      {/* Filter Bar */}
      <AppCard className="mb-4 bg-light border-0">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small text-muted fw-semibold mb-1">Department</label>
            <select 
              className="form-select" 
              value={filters.departmentId} 
              onChange={(e) => setFilters(prev => ({ ...prev, departmentId: e.target.value }))}
            >
              <option value="">Select Department...</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.departmentName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted fw-semibold mb-1">Month</label>
            <select 
              className="form-select" 
              value={filters.month} 
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
            >
              <option value="">Select Month...</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small text-muted fw-semibold mb-1">Year</label>
            <input 
              type="number" 
              className="form-control" 
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              min="2000" max="2100"
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <AppButton 
              variant="primary" 
              icon="bi-search" 
              className="flex-grow-1"
              onClick={handleSearch}
              disabled={isSearchDisabled}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </AppButton>
            <AppButton 
              variant="outline-secondary" 
              icon="bi-arrow-counterclockwise" 
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </AppButton>
          </div>
        </div>
      </AppCard>

      {/* Main Dashboard Display */}
      {isLoading ? (
        <div className="py-5"><PageLoader message="Generating financial report..." /></div>
      ) : summary ? (
        <div>
          <h5 className="mb-4 text-primary">
            <i className="bi bi-bar-chart-fill me-2"></i>
            {summary.departmentName} - {typeof summary.month === 'number' ? MONTHS[summary.month - 1] : summary.month} {summary.year} Report
          </h5>
          
          <div className="row">
            {/* Financial Metrics */}
            <MetricCard 
              title="Monthly Budget" 
              value={summary.monthlyBudget} 
              icon="bi-piggy-bank" 
              colorClass="primary" 
              isCurrency={true} 
              className="bento-card-large"
            />
            <MetricCard 
              title="Approved Expenses" 
              value={summary.totalApprovedExpense} 
              icon="bi-check-circle" 
              colorClass="success" 
              isCurrency={true} 
            />
            <MetricCard 
              title="Pending Expenses" 
              value={summary.totalPendingExpense} 
              icon="bi-hourglass-split" 
              colorClass="warning" 
              isCurrency={true} 
            />
            <MetricCard 
              title="Remaining Budget" 
              value={summary.remainingBudget} 
              icon="bi-wallet2" 
              colorClass="info" 
              isCurrency={true}
              className="bento-card-large"
            />

            {/* Operational Metrics */}
            <MetricCard 
              title="Approved Claims" 
              value={summary.approvedClaimCount} 
              icon="bi-file-earmark-check" 
              colorClass="success" 
            />
            <MetricCard 
              title="Pending Claims" 
              value={summary.pendingClaimCount} 
              icon="bi-file-earmark-medical" 
              colorClass="warning" 
            />
            <MetricCard 
              title="Rejected Claims" 
              value={summary.rejectedClaimCount} 
              icon="bi-file-earmark-x" 
              colorClass="danger" 
            />
          </div>
        </div>
      ) : (
        <AppCard className="py-5 border-0 bg-transparent shadow-none">
          <EmptyState 
            title="No Report Generated" 
            message="Select a department, month, and year above and click Search to view the financial summary."
            icon="bi-graph-up-arrow"
          />
        </AppCard>
      )}
    </div>
  );
};
