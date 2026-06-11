// ============================================
// HMITLC LMS - Image Loader Utility
// Preloads and processes images for ID card
// ============================================

import { VALIDATION } from '../constants';

/**
 * Preload an image and return as base64
 * @param {string} src - Image URL or base64
 * @returns {Promise<string|null>} - Base64 image or null
 */
export const preloadImage = (src) => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    // If already base64, return directly
    if (src.startsWith('data:image')) {
      resolve(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to image natural size (max 400px)
        const maxSize = 400;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw white background first (for transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(base64);
      } catch (e) {
        // Fallback to original src
        resolve(src);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = src;
  });
};

/**
 * Validate image file
 * @param {File} file - File object
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${VALIDATION.ALLOWED_IMAGE_TYPES.join(', ')}` };
  }

  if (file.size > VALIDATION.PROFILE_IMAGE_MAX_SIZE) {
    return { valid: false, error: `File too large. Maximum size: ${VALIDATION.PROFILE_IMAGE_MAX_SIZE / 1024 / 1024}MB` };
  }

  return { valid: true, error: null };
};

/**
 * Read file as data URL
 * @param {File} file - File object
 * @returns {Promise<string>} - Data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image
 * @param {string} dataUrl - Image data URL
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} - Compressed data URL
 */
export const compressImage = async (dataUrl, maxWidth = 400, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.src = dataUrl;
  });
};

/**
 * Create placeholder avatar SVG
 * @param {string} initials - User initials
 * @returns {string} - SVG data URL
 */
export const createPlaceholderAvatar = (initials = '') => {
  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#c8d4e8"/>
      <circle cx="50" cy="35" r="18" fill="#8a9fc0"/>
      <path d="M20 85 Q50 55 80 85 L80 90 L20 90 Z" fill="#8a9fc0"/>
      <text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#ffffff">${initials.substring(0, 2).toUpperCase()}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Load multiple images
 * @param {Array} sources - Array of image sources
 * @returns {Promise<Array>} - Array of base64 images
 */
export const loadMultipleImages = async (sources) => {
  const promises = sources.map((src) => preloadImage(src));
  return Promise.all(promises);
};

export default {
  preloadImage,
  validateImageFile,
  readFileAsDataURL,
  compressImage,
  createPlaceholderAvatar,
  loadMultipleImages,
};