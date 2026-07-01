import apiClient from '../config/apiClient';
import { API_ENDPOINTS } from '../constants';

export const departmentService = {
  getAllDepartments: async () => {
    return await apiClient.get(API_ENDPOINTS.DEPARTMENTS);
  },
  
  createDepartment: async (data) => {
    return await apiClient.post(API_ENDPOINTS.DEPARTMENTS, data);
  },
  
  updateDepartment: async (id, data) => {
    return await apiClient.put(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, data);
  },
  
  deleteDepartment: async (id) => {
    return await apiClient.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  }
};
