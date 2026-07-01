import apiClient from '../config/apiClient';
import { API_ENDPOINTS } from '../constants';

export const reviewService = {
  reviewClaim: async (claimId, payload) => {
    // payload should contain { recommendedStatus: 'APPROVED' | 'REJECTED', reviewRemark: string }
    return await apiClient.post(API_ENDPOINTS.FINANCE_REVIEW(claimId), payload);
  }
};
