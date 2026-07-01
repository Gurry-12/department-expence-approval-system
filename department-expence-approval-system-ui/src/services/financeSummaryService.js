import apiClient from '../config/apiClient';
import { API_ENDPOINTS } from '../constants';

export const financeSummaryService = {
  getSummary: async (departmentId, month, year) => {
    return await apiClient.get(API_ENDPOINTS.FINANCE_SUMMARY, {
      params: {
        departmentId,
        month,
        year
      }
    });
  }
};
