/**
 * Axios instance configuration
 */

import axios from 'axios';
import { API_BASE_URL } from '@/constants';

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: `/${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Cache for the auth store import to avoid repeated dynamic imports
let authStorePromise: Promise<typeof import('@/stores/useAuthStore')> | null = null;

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Token will be added per-request as needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      // Handle 401 Unauthorized - automatically logout
      if (error.response.status === 401) {
        // Import clearAuth dynamically to avoid circular dependency
        // Cache the import promise to avoid repeated imports
        if (!authStorePromise) {
          authStorePromise = import('@/stores/useAuthStore');
        }
        
        authStorePromise
          .then(({ useAuthStore }) => {
            const clearAuth = useAuthStore.getState().clearAuth;
            clearAuth();
            
            // Redirect to login page if not already there
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
              window.location.href = '/';
            }
          })
          .catch((importError) => {
            // Log error if import fails, but still try to redirect to login
            console.error('Failed to import auth store for logout:', importError);
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
              window.location.href = '/';
            }
          });
      }
      
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
