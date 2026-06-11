// ============================================
// HMITLC LMS - Admission Service
// ============================================

import { apiService } from './api';
import { API, ADMISSION_STATUS } from '../constants';

export const admissionService = {
  // Submit new admission
  submit: async (admissionData) => {
    const response = await apiService.post(API.ENDPOINTS.ADMISSIONS, admissionData);
    return response.data;
  },

  // Get all admissions (Admin/Teacher)
  getAll: async (params = {}) => {
    const response = await apiService.get(API.ENDPOINTS.ADMISSIONS, { params });
    return response.data;
  },

  // Get pending admissions
  getPending: async () => {
    const response = await apiService.get(API.ENDPOINTS.ADMISSIONS, {
      params: { status: ADMISSION_STATUS.PENDING },
    });
    return response.data;
  },

  // Get my admission (Student)
  getMyAdmission: async () => {
    const response = await apiService.get(`${API.ENDPOINTS.ADMISSIONS}/my`);
    return response.data;
  },

  // Get admission by ID
  getById: async (id) => {
    const response = await apiService.get(`${API.ENDPOINTS.ADMISSIONS}/${id}`);
    return response.data;
  },

  // Get admission by CNIC (for ID card)
  getByCnic: async (cnic) => {
    const response = await apiService.get(API.ENDPOINTS.ID_CARD, { params: { cnic } });
    return response.data;
  },

  // Approve admission (Admin/Teacher)
  approve: async (id, data = {}) => {
    const response = await apiService.patch(`${API.ENDPOINTS.ADMISSIONS}/${id}`, {
      status: ADMISSION_STATUS.APPROVED,
      ...data,
    });
    return response.data;
  },

  // Reject admission (Admin/Teacher)
  reject: async (id, rejectionNote) => {
    const response = await apiService.patch(`${API.ENDPOINTS.ADMISSIONS}/${id}`, {
      status: ADMISSION_STATUS.REJECTED,
      rejectionNote,
    });
    return response.data;
  },

  // Update admission
  update: async (id, data) => {
    const response = await apiService.patch(`${API.ENDPOINTS.ADMISSIONS}/${id}`, data);
    return response.data;
  },

  // Delete admission (Admin)
  delete: async (id) => {
    const response = await apiService.delete(`${API.ENDPOINTS.ADMISSIONS}/${id}`);
    return response.data;
  },

  // Assign class timing
  assignTiming: async (id, classTiming, classDays, batchName) => {
    const response = await apiService.patch(`${API.ENDPOINTS.ADMISSIONS}/${id}/timing`, {
      classTiming,
      classDays,
      batchName,
    });
    return response.data;
  },

  // Check if CNIC already exists
  checkCnic: async (cnic) => {
    const response = await apiService.get(`${API.ENDPOINTS.ADMISSIONS}/check-cnic`, {
      params: { cnic },
    });
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await apiService.get(`${API.ENDPOINTS.ADMISSIONS}/stats`);
    return response.data;
  },
};

export default admissionService;