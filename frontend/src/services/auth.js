// ============================================
// HMITLC LMS - Auth Service
// ============================================

import { apiService } from './api';
import { API, STORAGE_KEYS, ROLES } from '../constants';

// Auth Service
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiService.post(`${API.ENDPOINTS.AUTH}/login`, credentials);
    const { token, user } = response.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return user;
  },

  // Signup
  signup: async (userData) => {
    const response = await apiService.post(`${API.ENDPOINTS.AUTH}/signup`, userData);
    const { token, user } = response.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return user;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiService.get(`${API.ENDPOINTS.AUTH}/me`);
    return response.data.user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check user role
  hasRole: (user, roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  },

  // Check if admin
  isAdmin: (user) => user?.role === ROLES.ADMIN,

  // Check if teacher
  isTeacher: (user) => user?.role === ROLES.TEACHER,

  // Check if student
  isStudent: (user) => user?.role === ROLES.STUDENT,
};

export default authService;