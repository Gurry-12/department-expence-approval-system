import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layout';
import { ROUTES } from '../constants';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '../context';
import {
  Dashboard,
  Departments,
  Budgets,
  ExpenseClaims,
  FinanceReview,
  FinanceSummary,
  NotFound
} from '../pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* Employee & Finance Manager routes */}
        <Route path={ROUTES.CLAIMS} element={<ExpenseClaims />} />

        {/* Finance Manager ONLY routes */}
        <Route 
          path={ROUTES.DEPARTMENTS} 
          element={
            <ProtectedRoute allowedRoles={[ROLES.FINANCE_MANAGER]}>
              <Departments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.BUDGETS} 
          element={
            <ProtectedRoute allowedRoles={[ROLES.FINANCE_MANAGER]}>
              <Budgets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.REVIEWS} 
          element={
            <ProtectedRoute allowedRoles={[ROLES.FINANCE_MANAGER]}>
              <FinanceReview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.FINANCE_SUMMARY} 
          element={
            <ProtectedRoute allowedRoles={[ROLES.FINANCE_MANAGER]}>
              <FinanceSummary />
            </ProtectedRoute>
          } 
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
