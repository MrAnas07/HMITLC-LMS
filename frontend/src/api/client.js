// ============================================
// HMITLC LMS - API Client
// Enhanced API client with better error handling
// ============================================

import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

// Create base API client
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      const url = error.config?.url || "";

      if (status === 401) {
        const isAuthRoute = url.includes("/auth/");
        const isRefreshCall = url.includes("/auth/me");
        const msg = (error.response.data?.message || "").toLowerCase();
        const isTokenExpired = msg.includes("token") || msg.includes("expired") || msg.includes("unauthorized") || msg.includes("invalid");

        if (isAuthRoute || isRefreshCall || isTokenExpired) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// Extract error message from response
export const getErrorMessage = (error) => {
  // Check for custom error message in response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for validation errors
  if (error.response?.data?.errors) {
    const errors = Object.values(error.response.data.errors);
    return errors[0]?.msg || errors[0] || 'Validation error';
  }

  // Network errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  // Fallback
  return error.message || 'Something went wrong';
};

// API methods
export const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;