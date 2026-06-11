// ============================================
// HMITLC LMS - Validators
// Reusable validation functions
// ============================================

import { PATTERNS, VALIDATION, ERROR_MESSAGES } from '../constants';

// Phone validation (Pakistani format - 11 digits)
export const isValidPhone = (value) => {
  return PATTERNS.PHONE.test(value);
};

export const validatePhone = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (!isValidPhone(value)) return ERROR_MESSAGES.INVALID_PHONE;
  return null;
};

// CNIC validation (Pakistani format - 13 digits)
export const isValidCnic = (value) => {
  return PATTERNS.CNIC.test(value);
};

export const validateCnic = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (!isValidCnic(value)) return ERROR_MESSAGES.INVALID_CNIC;
  return null;
};

// Email validation
export const isValidEmail = (value) => {
  return PATTERNS.EMAIL.test(value);
};

export const validateEmail = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (!isValidEmail(value)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

// Password validation
export const isValidPassword = (value) => {
  return PATTERNS.PASSWORD.test(value);
};

export const validatePassword = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (!isValidPassword(value)) return ERROR_MESSAGES.INVALID_PASSWORD;
  return null;
};

// Name validation
export const validateName = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (value.length < VALIDATION.NAME_MIN_LENGTH) {
    return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
  }
  if (value.length > VALIDATION.NAME_MAX_LENGTH) {
    return `Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }
  return null;
};

// Address validation
export const validateAddress = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (value.length > VALIDATION.ADDRESS_MAX_LENGTH) {
    return `Address must not exceed ${VALIDATION.ADDRESS_MAX_LENGTH} characters`;
  }
  return null;
};

// Date of birth validation
export const validateDateOfBirth = (value) => {
  if (!value) return ERROR_MESSAGES.REQUIRED;

  const date = new Date(value);
  const now = new Date();
  const minAge = 10;
  const maxAge = 100;

  if (date > now) return 'Date of birth cannot be in the future';

  const age = (now - date) / (365.25 * 24 * 60 * 60 * 1000);
  if (age < minAge) return `You must be at least ${minAge} years old`;
  if (age > maxAge) return 'Invalid date of birth';

  return null;
};

// URL validation
export const isValidUrl = (value) => {
  return PATTERNS.URL.test(value);
};

// File validation for images
export const validateImageFile = (file) => {
  if (!file) return ERROR_MESSAGES.REQUIRED;

  const allowedTypes = VALIDATION.ALLOWED_IMAGE_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return ERROR_MESSAGES.INVALID_FILE_TYPE;
  }

  if (file.size > VALIDATION.PROFILE_IMAGE_MAX_SIZE) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  return null;
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate length
export const validateLength = (value, min, max, fieldName = 'This field') => {
  if (min && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (max && value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

// Validate select/option
export const validateSelect = (value, fieldName = 'This field') => {
  if (!value || value === '') {
    return `Please select a ${fieldName.toLowerCase()}`;
  }
  return null;
};

// Validate checkbox/radio
export const validateCheckbox = (value, fieldName = 'This field') => {
  if (!value) {
    return `Please select ${fieldName.toLowerCase()}`;
  }
  return null;
};

// Custom validator wrapper
export const createValidator = (validators) => {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

// Validate entire form
export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, rules] of Object.entries(rules)) {
    for (const rule of rules) {
      const error = rule(data[field], field);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidPhone,
  validatePhone,
  isValidCnic,
  validateCnic,
  isValidEmail,
  validateEmail,
  isValidPassword,
  validatePassword,
  validateName,
  validateAddress,
  validateDateOfBirth,
  isValidUrl,
  validateImageFile,
  validateRequired,
  validateLength,
  validateSelect,
  validateCheckbox,
  createValidator,
  validateForm,
};