import apiClient from '../config/apiClient';
import { API_ENDPOINTS } from '../constants';

export const budgetService = {
  getAllBudgets: async () => {
    return await apiClient.get(API_ENDPOINTS.BUDGETS);
  },
  
  getBudgetsByDepartment: async (departmentId) => {
    return await apiClient.get(API_ENDPOINTS.BUDGETS_BY_DEPARTMENT(departmentId));
  },
  
  createBudget: async (data) => {
    return await apiClient.post(API_ENDPOINTS.BUDGETS, data);
  },
  
  updateBudget: async (id, data) => {
    return await apiClient.put(`${API_ENDPOINTS.BUDGETS}/${id}`, data);
  },
  
  deleteBudget: async (id) => {
    return await apiClient.delete(`${API_ENDPOINTS.BUDGETS}/${id}`);
  }
};
