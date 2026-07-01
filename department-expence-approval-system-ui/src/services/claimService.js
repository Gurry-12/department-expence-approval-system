import apiClient from '../config/apiClient';
import { API_ENDPOINTS } from '../constants';

export const claimService = {
  getAllClaims: async (params = {}) => {
    // Filter out undefined, null, or empty string values from params
    const cleanParams = Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        acc[key] = params[key];
      }
      return acc;
    }, {});
    
    return await apiClient.get(API_ENDPOINTS.CLAIMS, { params: cleanParams });
  },
  
  createClaim: async (data) => {
    return await apiClient.post(API_ENDPOINTS.CLAIMS, data);
  },
  
  updateClaim: async (id, data) => {
    return await apiClient.put(`${API_ENDPOINTS.CLAIMS}/${id}`, data);
  },
  
  deleteClaim: async (id) => {
    return await apiClient.delete(`${API_ENDPOINTS.CLAIMS}/${id}`);
  }
};
