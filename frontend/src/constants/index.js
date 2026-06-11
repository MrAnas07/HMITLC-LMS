// ============================================
// HMITLC LMS - Application Constants
// ============================================

// Validation Constants
export const VALIDATION = {
  PHONE_LENGTH: 11,
  CNIC_LENGTH: 13,
  ADDRESS_MAX_LENGTH: 220,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PROFILE_IMAGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// API Configuration
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    AUTH: '/auth',
    COURSES: '/courses',
    ADMISSIONS: '/admissions',
    USERS: '/users',
    CATEGORIES: '/categories',
    CONTACT: '/contact',
    ID_CARD: '/id-card',
    ATTENDANCE: '/attendance',
  },
};

// Toast Configuration
export const TOAST = {
  DURATION: 4000,
  POSITION: 'bottom-right',
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZES: [10, 25, 50],
};

// Student ID Pattern
export const STUDENT_ID = {
  PREFIX: 'HMITC',
  YEAR: new Date().getFullYear(),
  FORMAT: (batch) => `${STUDENT_ID.PREFIX}-${STUDENT_ID.YEAR}-${String(batch).padStart(3, '0')}`,
};

// Admission Status
export const ADMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Class Timing Options
export const CLASS_TIMINGS = [
  { id: 'morning', label: 'Morning (9:00 AM - 12:00 PM)', start: '09:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon (12:00 PM - 3:00 PM)', start: '12:00', end: '15:00' },
  { id: 'evening', label: 'Evening (3:00 PM - 6:00 PM)', start: '15:00', end: '18:00' },
  { id: 'night', label: 'Night (6:00 PM - 9:00 PM)', start: '18:00', end: '21:00' },
];

// Days Options
export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Proficiency Levels
export const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'No prior experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'Basic knowledge' },
  { value: 'advanced', label: 'Advanced', description: 'Professional experience' },
];

// Qualification Options
export const QUALIFICATIONS = [
  { value: 'matric', label: 'Matriculation' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'post_graduate', label: 'Post Graduate' },
  { value: 'other', label: 'Other' },
];

// Referral Sources
export const REFERRAL_SOURCES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'google', label: 'Google Search' },
  { value: 'friend', label: 'Friend/Relative' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'other', label: 'Other' },
];

// ID Card Design
export const ID_CARD = {
  COLORS: {
    PRIMARY_BLUE: '#1045b8',
    DARK_BLUE: '#0d3b8e',
    WHITE: '#ffffff',
    LIGHT_GRAY: '#f4f7fc',
    SUCCESS_GREEN: '#22c55e',
    WARNING: '#fbbf24',
    ERROR: '#ef4444',
  },
  DIMENSIONS: {
    WIDTH: 54,
    HEIGHT: 86,
    PDF_WIDTH: 175,
    PDF_HEIGHT: 100,
  },
  QR: {
    SIZE: 88,
    MARGIN: 1,
    DARK_COLOR: '#0d3b8e',
    LIGHT_COLOR: '#ffffff',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'lms_token',
  USER: 'lms_user',
  DARK_MODE: 'lms_dark_mode',
  THEME: 'lms_theme',
  LANGUAGE: 'lms_language',
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
};

// Regex Patterns
export const PATTERNS = {
  PHONE: /^\d{11}$/,
  CNIC: /^\d{13}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/.+/,
  POSTAL_CODE: /^\d{5}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_PHONE: 'Phone number must be 11 digits',
  INVALID_CNIC: 'CNIC must be 13 digits',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  FILE_TOO_LARGE: 'File size exceeds maximum limit of 2MB',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload JPG or PNG images',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  UNAUTHORIZED: 'Session expired. Please login again',
  NOT_FOUND: 'Resource not found',
  DUPLICATE: 'This record already exists',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Saved successfully',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SUBMITTED: 'Submitted successfully',
  APPROVED: 'Approved successfully',
  REJECTED: 'Rejected successfully',
  LOGIN: 'Login successful',
  LOGOUT: 'Logged out successfully',
  REGISTRATION: 'Registration successful',
};

export default {
  VALIDATION,
  API,
  TOAST,
  PAGINATION,
  STUDENT_ID,
  ADMISSION_STATUS,
  ROLES,
  CLASS_TIMINGS,
  WEEKDAYS,
  PROFICIENCY_LEVELS,
  QUALIFICATIONS,
  REFERRAL_SOURCES,
  ID_CARD,
  STORAGE_KEYS,
  DATE_FORMATS,
  PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};