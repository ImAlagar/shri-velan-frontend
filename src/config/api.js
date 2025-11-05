// config/api.js - UPDATED with proper error handling
import axios from 'axios';
import { config } from '../config/env';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token'); // Use the same key as your login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling - FIXED
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Don't redirect immediately for API calls
      // Let the component handle the error
      console.warn('API 401 - Token might be invalid or expired');
      
      // Only redirect if it's not an API call and we're on a protected page
      if (!originalRequest._retry && window.location.pathname.startsWith('/admin')) {
        // You can implement token refresh logic here if you have refresh tokens
        // For now, just reject the promise and let components handle it
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        
        // Use setTimeout to avoid redirect during React rendering
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;