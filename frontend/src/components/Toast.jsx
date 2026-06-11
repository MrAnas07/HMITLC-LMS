// ============================================
// HMITLC LMS - Toast Notification System
// Improved toast with better UX
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { TOAST } from '../constants';

// Toast styles configuration
const TOAST_CONFIG = {
  [TOAST.TYPES.SUCCESS]: {
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-300',
    iconClass: 'text-emerald-500',
  },
  [TOAST.TYPES.ERROR]: {
    icon: XCircle,
    bgClass: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300',
    iconClass: 'text-red-500',
  },
  [TOAST.TYPES.WARNING]: {
    icon: AlertCircle,
    bgClass: 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-300',
    iconClass: 'text-amber-500',
  },
  [TOAST.TYPES.INFO]: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300',
    iconClass: 'text-blue-500',
  },
};

// Show toast globally
export const showToast = (message, type = TOAST.TYPES.SUCCESS) => {
  window.dispatchEvent(
    new CustomEvent('lms-toast', {
      detail: { message, type, id: Date.now() },
    })
  );
};

// Success shortcut
export const showSuccess = (message) => showToast(message, TOAST.TYPES.SUCCESS);

// Error shortcut
export const showError = (message) => showToast(message, TOAST.TYPES.ERROR);

// Warning shortcut
export const showWarning = (message) => showToast(message, TOAST.TYPES.WARNING);

// Info shortcut
export const showInfo = (message) => showToast(message, TOAST.TYPES.INFO);

// Toast Container Component
const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type, id } = e.detail;
      const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

      // Add new toast
      setToasts((prev) => [...prev, { message, type, id, config }]);

      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, TOAST.DURATION);
    };

    window.addEventListener('lms-toast', handleToast);
    return () => window.removeEventListener('lms-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = toast.config.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              layout
              className={`flex min-w-[300px] max-w-md items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${toast.config.bgClass}`}
              role="alert"
            >
              <Icon className={`h-5 w-5 shrink-0 ${toast.config.iconClass}`} />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;