import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layout';
import { ROUTES } from '../constants';
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
        <Route path={ROUTES.DEPARTMENTS} element={<Departments />} />
        <Route path={ROUTES.BUDGETS} element={<Budgets />} />
        <Route path={ROUTES.CLAIMS} element={<ExpenseClaims />} />
        <Route path={ROUTES.REVIEWS} element={<FinanceReview />} />
        <Route path={ROUTES.FINANCE_SUMMARY} element={<FinanceSummary />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
