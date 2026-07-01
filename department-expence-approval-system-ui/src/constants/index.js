export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  DEPARTMENTS: '/api/departments',
  BUDGETS: '/api/budgets',
  BUDGETS_BY_DEPARTMENT: (id) => `/api/budgets/department/${id}`,
  CLAIMS: '/api/claims',
  FINANCE_REVIEW: (id) => `/api/review/${id}`,
  FINANCE_SUMMARY: '/api/finance-summary',
};

export const ROUTES = {
  HOME: '/',
  DEPARTMENTS: '/departments',
  BUDGETS: '/budgets',
  CLAIMS: '/claims',
  REVIEWS: '/reviews',
  FINANCE_SUMMARY: '/finance-summary',
};

export const CLAIM_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const EXPENSE_CATEGORIES = [
  'TRAVEL',
  'MEALS',
  'SUPPLIES',
  'EQUIPMENT',
  'OTHER'
];

export const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];
