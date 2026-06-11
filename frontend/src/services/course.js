// ============================================
// HMITLC LMS - Course Service
// ============================================

import { apiService } from './api';
import { API } from '../constants';

export const courseService = {
  // Get all courses
  getAll: async (params = {}) => {
    const response = await apiService.get(API.ENDPOINTS.COURSES, { params });
    return response.data;
  },

  // Get published courses (public)
  getPublished: async (params = {}) => {
    const response = await apiService.get(`${API.ENDPOINTS.COURSES}/published`, { params });
    return response.data;
  },

  // Get course by ID
  getById: async (id) => {
    const response = await apiService.get(`${API.ENDPOINTS.COURSES}/${id}`);
    return response.data;
  },

  // Get course by slug
  getBySlug: async (slug) => {
    const response = await apiService.get(`${API.ENDPOINTS.COURSES}/slug/${slug}`);
    return response.data;
  },

  // Create course (Admin/Teacher)
  create: async (courseData) => {
    const response = await apiService.post(API.ENDPOINTS.COURSES, courseData);
    return response.data;
  },

  // Update course (Admin/Teacher)
  update: async (id, courseData) => {
    const response = await apiService.patch(`${API.ENDPOINTS.COURSES}/${id}`, courseData);
    return response.data;
  },

  // Delete course (Admin)
  delete: async (id) => {
    const response = await apiService.delete(`${API.ENDPOINTS.COURSES}/${id}`);
    return response.data;
  },

  // Publish course
  publish: async (id) => {
    const response = await apiService.patch(`${API.ENDPOINTS.COURSES}/${id}/publish`);
    return response.data;
  },

  // Unpublish course
  unpublish: async (id) => {
    const response = await apiService.patch(`${API.ENDPOINTS.COURSES}/${id}/unpublish`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await apiService.get(API.ENDPOINTS.CATEGORIES);
    return response.data;
  },

  // Search courses
  search: async (query) => {
    const response = await apiService.get(`${API.ENDPOINTS.COURSES}/search`, {
      params: { q: query },
    });
    return response.data;
  },
};

export default courseService;