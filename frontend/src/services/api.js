// ============================================
// HMITLC LMS - API Service
// Centralized API handling with retry logic
// ============================================

import axios from 'axios';
import { API, STORAGE_KEYS } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthRoute = url.includes("/auth/");
      const msg = (error.response.data?.message || "").toLowerCase();
      const isTokenIssue = msg.includes("token") || msg.includes("expired") || msg.includes("unauthorized") || msg.includes("invalid");

      if (isAuthRoute || isTokenIssue) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Generic request method with retry
const requestWithRetry = async (method, url, options = {}, retries = API.RETRY_ATTEMPTS) => {
  try {
    const response = await api[method](url, options);
    return response;
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return requestWithRetry(method, url, options, retries - 1);
    }
    throw error;
  }
};

// Check if request should retry
const shouldRetry = (error) => {
  return !error.response || error.response.status >= 500 || error.code === 'ECONNABORTED';
};

// API Methods
export const apiService = {
  // GET request
  get: (url, config = {}) => requestWithRetry('get', url, config),

  // POST request
  post: (url, data = {}, config = {}) => requestWithRetry('post', url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => requestWithRetry('put', url, data, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => requestWithRetry('patch', url, data, config),

  // DELETE request
  delete: (url, config = {}) => requestWithRetry('delete', url, config),
};

export default apiService;