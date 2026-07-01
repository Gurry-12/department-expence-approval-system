import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PageHeader, AppButton } from '../common';
import { ROUTES, CLAIM_STATUS } from '../constants';
import { useRole, ROLES } from '../context';
import { claimService } from '../services/claimService';
import { departmentService } from '../services/departmentService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../common';
import { ExpenseClaimFormModal } from '../components/claims/ExpenseClaimFormModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// ── Metric card ──────────────────────────────────────────────
const MetricCard = ({ label, value, icon, bg, color, sub, className = '' }) => (
  <div className={`ef-metric-card h-100 ${className}`}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <p className="ef-metric-label">{label}</p>
      <div className="ef-metric-icon" style={{ background: bg }}>
        <i className={`bi ${icon}`} style={{ color, fontSize: 18 }} aria-hidden="true" />
      </div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p className="ef-metric-value mb-1">{value ?? '—'}</p>
      {sub && <p className="ef-metric-sub mb-0" style={{ fontSize: 12, color: '#64748B' }}>{sub}</p>}
    </div>
  </div>
);

// ── Nav card (quick access) ───────────────────────────────────
const NavCard = ({ to, icon, label, sub, iconBg, iconColor }) => (
  <Link to={to} className="ef-nav-card" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', textDecoration: 'none', borderRadius: 8, transition: 'background 0.2s', border: '1px solid transparent' }}>
    <div className="ef-nav-card-icon" style={{ background: iconBg, width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
      <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: 16 }} aria-hidden="true" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p className="ef-nav-card-label" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
      <p className="ef-nav-card-sub" style={{ margin: 0, fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>
    </div>
    <i className="bi bi-chevron-right ms-2" style={{ color: '#CBD5E1', fontSize: 14 }} aria-hidden="true" />
  </Link>
);

// ── Section header ────────────────────────────────────────────
const SectionTitle = ({ icon, label }) => (
  <div className="ef-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
    <i className={`bi ${icon}`} aria-hidden="true" style={{ color: '#64748B' }} />
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Finance Manager Dashboard
// ─────────────────────────────────────────────────────────────
const FinanceDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentPending, setRecentPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingRes, approvedRes, rejectedRes, deptsRes, recentRes] = await Promise.allSettled([
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.PENDING }),
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.APPROVED }),
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.REJECTED }),
        departmentService.getAllDepartments(),
        claimService.getAllClaims({ page: 0, size: 6, status: CLAIM_STATUS.PENDING, sortBy: 'createdAt', sortDir: 'asc' }),
      ]);

      setMetrics({
        pending:  pendingRes.value?.data?.totalElements  ?? 0,
        approved: approvedRes.value?.data?.totalElements ?? 0,
        rejected: rejectedRes.value?.data?.totalElements ?? 0,
        depts:    deptsRes.value?.data?.length           ?? 0,
      });
      setRecentPending(recentRes.value?.data?.content ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Pending', value: metrics.pending, fill: '#F59E0B' },
      { name: 'Approved', value: metrics.approved, fill: '#10B981' },
      { name: 'Rejected', value: metrics.rejected, fill: '#EF4444' }
    ];
  }, [metrics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title={`${greeting}, Finance Manager`}
        subtitle={`${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <MetricCard
            label="Pending Review"
            value={isLoading ? '…' : metrics?.pending}
            icon="bi-clock-fill"
            bg="#FFFBEB" color="#D97706"
            sub="Awaiting action"
          />
        </div>
        <div className="col-6 col-lg-3">
          <MetricCard
            label="Approved"
            value={isLoading ? '…' : metrics?.approved}
            icon="bi-check-circle-fill"
            bg="#F0FDF4" color="#16A34A"
            sub="Total approved"
          />
        </div>
        <div className="col-6 col-lg-3">
          <MetricCard
            label="Rejected"
            value={isLoading ? '…' : metrics?.rejected}
            icon="bi-x-circle-fill"
            bg="#FEF2F2" color="#DC2626"
            sub="Total rejected"
          />
        </div>
        <div className="col-6 col-lg-3">
          <MetricCard
            label="Departments"
            value={isLoading ? '…' : metrics?.depts}
            icon="bi-building-fill"
            bg="#EFF6FF" color="#2563EB"
            sub="Active departments"
          />
        </div>
      </div>

      <div className="row g-3 flex-grow-1">
        {/* Left column (Stretches) */}
        <div className="col-12 col-xl-8 d-flex flex-column gap-3">
          
          {/* Chart Card */}
          <div className="card w-100" style={{ minHeight: 300, flex: '0 0 auto' }}>
            <div className="card-body d-flex flex-column" style={{ padding: '20px 24px' }}>
              <SectionTitle icon="bi-bar-chart-fill" label="Claim Status Distribution" />
              <div className="flex-grow-1 mt-3" style={{ position: 'relative', height: 220 }}>
                {isLoading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="spinner-border text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                      <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Recent pending claims */}
          <div className="card w-100 flex-grow-1 d-flex flex-column">
            <div className="card-body d-flex flex-column" style={{ padding: '20px 24px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <SectionTitle icon="bi-clock-history" label="Recent Pending Claims" />
                <Link
                  to={ROUTES.REVIEWS}
                  style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
                >
                  View All →
                </Link>
              </div>
              {isLoading ? (
                <div className="flex-grow-1">
                  {[1,2,3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '20%', height: 14 }} />
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '30%', height: 14 }} />
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '15%', height: 14 }} />
                    </div>
                  ))}
                </div>
              ) : recentPending.length === 0 ? (
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-4" style={{ color: '#94A3B8' }}>
                  <i className="bi bi-check-circle" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
                  <span style={{ fontSize: 14 }}>No pending claims — you're all caught up!</span>
                </div>
              ) : (
                <div className="table-responsive flex-grow-1">
                  <table className="table table-hover mb-0 align-middle" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th scope="col">Employee</th>
                        <th scope="col">Category</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPending.map(claim => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: 600, color: '#1E293B' }}>{claim.employeeName}</td>
                          <td style={{ color: '#64748B' }}>{claim.expenseCategory?.replace(/_/g,' ')}</td>
                          <td style={{ fontWeight: 700, color: '#1E293B' }}>{formatCurrency(claim.amount)}</td>
                          <td style={{ color: '#94A3B8' }}>{formatDate(claim.expenseDate)}</td>
                          <td>
                            <Link
                              to={ROUTES.REVIEWS}
                              className="btn btn-light btn-sm"
                              style={{ fontSize: 11, padding: '3px 10px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', border: 'none' }}
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">
          {/* Quick actions */}
          <div className="card w-100 flex-shrink-0">
            <div className="card-body" style={{ padding: '20px 24px' }}>
              <SectionTitle icon="bi-lightning-charge-fill" label="Quick Actions" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
                <Link to={ROUTES.REVIEWS} className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 mb-2" style={{ fontWeight: 600 }}>
                  <i className="bi bi-clipboard2-check" aria-hidden="true" />
                  Review Pending Claims
                  {metrics?.pending > 0 && (
                    <span className="ms-2 badge bg-white text-primary rounded-pill">
                      {metrics.pending}
                    </span>
                  )}
                </Link>
                <AppButton variant="outline-primary" icon="bi-bar-chart" className="w-100 d-flex justify-content-center text-start" onClick={() => window.location.href = ROUTES.FINANCE_SUMMARY}>
                  View Finance Summary
                </AppButton>
              </div>
            </div>
          </div>

          {/* Navigation cards */}
          <div className="card w-100 flex-grow-1 d-flex flex-column">
            <div className="card-body d-flex flex-column" style={{ padding: '20px 24px' }}>
              <SectionTitle icon="bi-grid-3x3-gap-fill" label="Modules" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16, flex: 1 }}>
                <NavCard to={ROUTES.DEPARTMENTS} icon="bi-building-fill" label="Departments" sub="Manage company departments" iconBg="#EFF6FF" iconColor="#2563EB" />
                <NavCard to={ROUTES.BUDGETS} icon="bi-wallet2" label="Budgets" sub="Monthly budget allocations" iconBg="#F0FDF4" iconColor="#16A34A" />
                <NavCard to={ROUTES.CLAIMS} icon="bi-receipt-cutoff" label="Expense Claims" sub="All submitted claims" iconBg="#FFFBEB" iconColor="#D97706" />
                <NavCard to={ROUTES.FINANCE_SUMMARY} icon="bi-bar-chart-fill" label="Finance Summary" sub="Analytics & reports" iconBg="#FEF2F2" iconColor="#DC2626" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Employee Dashboard
// ─────────────────────────────────────────────────────────────
const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allRes, pendingRes, approvedRes, rejectedRes, deptRes] = await Promise.allSettled([
        claimService.getAllClaims({ page: 0, size: 7, sortBy: 'createdAt', sortDir: 'desc' }),
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.PENDING }),
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.APPROVED }),
        claimService.getAllClaims({ page: 0, size: 1, status: CLAIM_STATUS.REJECTED }),
        departmentService.getAllDepartments(),
      ]);
      setMetrics({
        total:    allRes.value?.data?.totalElements    ?? 0,
        pending:  pendingRes.value?.data?.totalElements  ?? 0,
        approved: approvedRes.value?.data?.totalElements ?? 0,
        rejected: rejectedRes.value?.data?.totalElements ?? 0,
      });
      setClaims(allRes.value?.data?.content ?? []);
      if (deptRes.value?.success && Array.isArray(deptRes.value.data)) {
        setDepartments(deptRes.value.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFormSubmit = async (payload) => {
    try {
      const res = await claimService.createClaim(payload);
      if (res.success) toast.success('Claim submitted successfully');
      setIsFormModalOpen(false);
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Pending', value: metrics.pending, fill: '#F59E0B' },
      { name: 'Approved', value: metrics.approved, fill: '#10B981' },
      { name: 'Rejected', value: metrics.rejected, fill: '#EF4444' }
    ].filter(d => d.value > 0);
  }, [metrics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title={`${greeting}!`}
        subtitle="Here's an overview of your expense claims."
        action={
          <button onClick={() => setIsFormModalOpen(true)} className="btn btn-primary shadow-sm" style={{ fontWeight: 600 }}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Submit New Claim
          </button>
        }
      />

      {/* Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <MetricCard label="Total Claims" value={isLoading ? '…' : metrics?.total} icon="bi-receipt-cutoff" bg="#EFF6FF" color="#2563EB" sub="All time submissions" />
        </div>
        <div className="col-6 col-md-4">
          <MetricCard label="Pending" value={isLoading ? '…' : metrics?.pending} icon="bi-clock-fill" bg="#FFFBEB" color="#D97706" sub="Awaiting review" />
        </div>
        <div className="col-6 col-md-4">
          <MetricCard label="Approved" value={isLoading ? '…' : metrics?.approved} icon="bi-check-circle-fill" bg="#F0FDF4" color="#16A34A" sub="Successfully processed" />
        </div>
      </div>

      <div className="row g-3 flex-grow-1">
        
        {/* Left Column: Recent Claims */}
        <div className="col-12 col-xl-8 d-flex">
          <div className="card w-100 flex-grow-1 d-flex flex-column">
            <div className="card-body d-flex flex-column" style={{ padding: '20px 24px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <SectionTitle icon="bi-clock-history" label="Recent Claims" />
                <Link to={ROUTES.CLAIMS} style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>
              {isLoading ? (
                <div className="flex-grow-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '25%', height: 14 }} />
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '20%', height: 14 }} />
                      <div className="ef-skeleton ef-skeleton-text" style={{ width: '15%', height: 14 }} />
                    </div>
                  ))}
                </div>
              ) : claims.length === 0 ? (
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5">
                  <i className="bi bi-receipt" style={{ fontSize: 48, color: '#CBD5E1', display: 'block', marginBottom: 12 }} />
                  <p style={{ color: '#94A3B8', fontSize: 15, margin: '0 0 20px', fontWeight: 500 }}>You haven't submitted any expense claims yet.</p>
                  <button onClick={() => setIsFormModalOpen(true)} className="btn btn-primary shadow-sm" style={{ fontWeight: 600 }}>
                    <i className="bi bi-plus-lg me-2" /> Submit Your First Claim
                  </button>
                </div>
              ) : (
                <div className="table-responsive flex-grow-1">
                  <table className="table table-hover mb-0 align-middle" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600, color: '#1E293B' }}>
                            <div className="d-flex flex-column">
                              <span>{c.expenseCategory?.replace(/_/g,' ')}</span>
                              <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>{c.department}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#0F172A' }}>{formatCurrency(c.amount)}</td>
                          <td style={{ color: '#64748B' }}>{formatDate(c.expenseDate)}</td>
                          <td><StatusBadge status={c.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="col-12 col-xl-4 d-flex">
          <div className="card w-100 flex-grow-1 d-flex flex-column">
            <div className="card-body d-flex flex-column" style={{ padding: '20px 24px' }}>
              <SectionTitle icon="bi-pie-chart-fill" label="My Claims Overview" />
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center mt-3" style={{ minHeight: 250 }}>
                {isLoading ? (
                  <span className="spinner-border text-primary" />
                ) : chartData.length === 0 ? (
                  <span style={{ color: '#94A3B8', fontSize: 13 }}>No data to display</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {isFormModalOpen && (
        <ExpenseClaimFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          departments={departments}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const { role } = useRole();
  return role === ROLES.FINANCE_MANAGER ? <FinanceDashboard /> : <EmployeeDashboard />;
};
