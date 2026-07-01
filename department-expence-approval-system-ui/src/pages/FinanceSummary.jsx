import { useState, useEffect, useCallback } from 'react';
import { PageHeader, AppCard, AppButton, PageLoader, EmptyState } from '../common';
import { departmentService } from '../services/departmentService';
import { financeSummaryService } from '../services/financeSummaryService';
import { formatCurrency } from '../utils/formatters';
import { MONTHS } from '../constants';

const exportToCSV = (summary) => {
  if (!summary) return;
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Department', summary.departmentName],
    ['Month', summary.month],
    ['Year', summary.year],
    ['Monthly Budget', summary.monthlyBudget],
    ['Approved Expenses', summary.totalApprovedExpense],
    ['Pending Expenses', summary.totalPendingExpense],
    ['Remaining Budget', summary.remainingBudget],
    ['Approved Claims Count', summary.approvedClaimCount],
    ['Pending Claims Count', summary.pendingClaimCount],
    ['Rejected Claims Count', summary.rejectedClaimCount],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finance_summary_${summary.departmentName}_${summary.month}_${summary.year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatMonth = (m) => {
  if (!m) return '';
  const name = typeof m === 'number' ? MONTHS[m - 1] : m;
  return name ? name.charAt(0) + name.slice(1).toLowerCase() : m;
};

// Metric Card
const MetricCard = ({ title, value, icon, color, subtle, isCurrency = false }) => (
  <div className="card h-100">
    <div className="card-body" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: subtle, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <i className={`bi ${icon}`} style={{ fontSize: 20, color }} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', margin: '0 0 4px' }}>
            {title}
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {isCurrency ? formatCurrency(value) : value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Budget utilization bar
const UtilizationBar = ({ budget, approved, pending }) => {
  if (!budget) return null;
  const approvedPct = Math.min(100, Math.round((approved / budget) * 100));
  const pendingPct  = Math.min(100 - approvedPct, Math.round((pending / budget) * 100));
  const remaining   = 100 - approvedPct - pendingPct;

  return (
    <div className="card">
      <div className="card-body" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Budget Utilization</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: approvedPct > 90 ? '#DC2626' : '#16A34A' }}>
            {approvedPct}% used
          </span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${approvedPct}%`, background: '#16A34A', transition: 'width 0.5s ease' }} title={`Approved: ${approvedPct}%`} />
          <div style={{ width: `${pendingPct}%`, background: '#FCD34D', transition: 'width 0.5s ease' }} title={`Pending: ${pendingPct}%`} />
          <div style={{ width: `${remaining}%`, background: '#E2E8F0' }} title={`Remaining: ${remaining}%`} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#16A34A', display: 'inline-block' }} />
            Approved ({approvedPct}%)
          </span>
          <span style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#FCD34D', display: 'inline-block' }} />
            Pending ({pendingPct}%)
          </span>
          <span style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#E2E8F0', display: 'inline-block' }} />
            Available ({remaining}%)
          </span>
        </div>
      </div>
    </div>
  );
};

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export const FinanceSummary = () => {
  const [departments, setDepartments] = useState([]);
  const [summary, setSummary]         = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [filters, setFilters] = useState({
    departmentId: '',
    month: '',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentService.getAllDepartments();
        if (res?.success && Array.isArray(res.data)) setDepartments(res.data);
      } catch { /* handled globally */ }
    };
    fetchDepts();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!filters.departmentId || !filters.month || !filters.year) return;
    setIsLoading(true);
    setSummary(null);
    try {
      const res = await financeSummaryService.getSummary(
        filters.departmentId, filters.month, filters.year
      );
      if (res?.success && res.data) setSummary(res.data);
    } catch { /* 404 handled globally */ }
    finally { setIsLoading(false); }
  }, [filters]);

  // Auto-search when all 3 fields are selected
  useEffect(() => {
    if (filters.departmentId && filters.month && filters.year) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.departmentId, filters.month, filters.year]);

  const handleReset = () => {
    setFilters({ departmentId: '', month: '', year: new Date().getFullYear().toString() });
    setSummary(null);
  };

  const isSearchDisabled = !filters.departmentId || !filters.month || !filters.year || isLoading;

  return (
    <div>
      <PageHeader
        title="Finance Summary"
        subtitle="Real-time financial analytics and budget consumption"
      />

      {/* Filter Bar */}
      <AppCard className="mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label htmlFor="fs-dept" className="ef-filter-label">Department <span style={{ color: '#DC2626' }}>*</span></label>
            <select
              id="fs-dept"
              className="form-select"
              value={filters.departmentId}
              onChange={(e) => setFilters(prev => ({ ...prev, departmentId: e.target.value }))}
            >
              <option value="">Select Department…</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <label htmlFor="fs-month" className="ef-filter-label">Month <span style={{ color: '#DC2626' }}>*</span></label>
            <select
              id="fs-month"
              className="form-select"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
            >
              <option value="">Select Month…</option>
              {MONTHS.map(m => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="fs-year" className="ef-filter-label">Year <span style={{ color: '#DC2626' }}>*</span></label>
            <select
              id="fs-year"
              className="form-select"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-3 d-flex gap-2">
            <AppButton
              variant="primary"
              icon="bi-search"
              className="flex-grow-1"
              onClick={handleSearch}
              disabled={isSearchDisabled}
            >
              {isLoading ? 'Loading…' : 'Generate Report'}
            </AppButton>
            <AppButton
              variant="outline-secondary"
              icon="bi-arrow-counterclockwise"
              onClick={handleReset}
              disabled={isLoading}
              title="Reset filters"
              ariaLabel="Reset filters"
            />
          </div>
        </div>
        {!filters.departmentId || !filters.month ? (
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-info-circle" />
            Select a department, month, and year to auto-generate the report.
          </p>
        ) : null}
      </AppCard>

      {/* Results */}
      {isLoading ? (
        <div className="card"><div className="card-body py-5"><PageLoader message="Generating financial report…" /></div></div>
      ) : summary ? (
        <div>
          {/* Report heading */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>
              <i className="bi bi-bar-chart-fill me-2" style={{ color: '#2563EB' }} aria-hidden="true" />
              {summary.departmentName} — {formatMonth(summary.month)} {summary.year}
            </h2>
            <AppButton
              variant="outline-primary"
              icon="bi-download"
              onClick={() => exportToCSV(summary)}
              size="sm"
            >
              Export CSV
            </AppButton>
          </div>

          {/* Utilization bar */}
          <div className="mb-4">
            <UtilizationBar
              budget={summary.monthlyBudget}
              approved={summary.totalApprovedExpense}
              pending={summary.totalPendingExpense}
            />
          </div>

          {/* Financial metrics */}
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 12px' }}>Financial Overview</p>
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <MetricCard title="Monthly Budget" value={summary.monthlyBudget} icon="bi-wallet2" color="#2563EB" subtle="#EFF6FF" isCurrency />
            </div>
            <div className="col-6 col-lg-3">
              <MetricCard title="Approved Expenses" value={summary.totalApprovedExpense} icon="bi-check-circle-fill" color="#16A34A" subtle="#F0FDF4" isCurrency />
            </div>
            <div className="col-6 col-lg-3">
              <MetricCard title="Pending Expenses" value={summary.totalPendingExpense} icon="bi-hourglass-split" color="#D97706" subtle="#FFFBEB" isCurrency />
            </div>
            <div className="col-6 col-lg-3">
              <MetricCard title="Remaining Budget" value={summary.remainingBudget} icon="bi-piggy-bank" color="#0891B2" subtle="#ECFEFF" isCurrency />
            </div>
          </div>

          {/* Operational metrics */}
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 12px' }}>Claims Breakdown</p>
          <div className="row g-3">
            <div className="col-4">
              <MetricCard title="Approved Claims" value={summary.approvedClaimCount} icon="bi-file-earmark-check-fill" color="#16A34A" subtle="#F0FDF4" />
            </div>
            <div className="col-4">
              <MetricCard title="Pending Claims" value={summary.pendingClaimCount} icon="bi-file-earmark-medical-fill" color="#D97706" subtle="#FFFBEB" />
            </div>
            <div className="col-4">
              <MetricCard title="Rejected Claims" value={summary.rejectedClaimCount} icon="bi-file-earmark-x-fill" color="#DC2626" subtle="#FEF2F2" />
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <EmptyState
              title="No Report Generated"
              description="Select a department, month, and year above to view the financial summary. The report will generate automatically."
              icon="bi-graph-up-arrow"
            />
          </div>
        </div>
      )}
    </div>
  );
};
