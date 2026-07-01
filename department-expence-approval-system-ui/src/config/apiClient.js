import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Optionally inject auth tokens here if added in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Return data directly if nested in our GlobalResponse structure
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Global error handling based on backend error codes
      if (status === 400) {
        let msg = "Validation Error";
        if (data && data.message) {
            msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        }
        toast.error(msg);
      } else if (status === 404) {
        toast.error(data?.message || "Resource not found");
      } else if (status === 409) {
        toast.error(data?.message || "Conflict detected. Please refresh and try again.");
      } else if (status >= 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error(data?.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
