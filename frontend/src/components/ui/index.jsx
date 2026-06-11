// ============================================
// HMITLC LMS - Reusable UI Components
// ============================================

import { Loader2 } from 'lucide-react';

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Loader2 className={`animate-spin text-academy-blue ${sizeClasses[size]} ${className}`} />
  );
};

// Loading Overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  </div>
);

// Button Spinner
export const ButtonSpinner = () => <Loader2 className="animate-spin" size={16} />;

// Skeleton Loader
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

// Card Skeleton
export const CardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-slate-200 dark:border-slate-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Page Loading
export const PageLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  </div>
);

// Empty State
export const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = '',
  action: ActionComponent,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && (
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Icon size={32} />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    )}
    {ActionComponent && <div className="mt-4">{ActionComponent}</div>}
  </div>
);

// Error State
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-4 rounded-full bg-red-100 p-3 text-red-500 dark:bg-red-900/20">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-primary mt-4"
      >
        Try Again
      </button>
    )}
  </div>
);

// Confirm Dialog
export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-academy-blue hover:bg-blue-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn-primary ${variantClasses[variant]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Status Badge Helper
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'default' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Export all components
export default {
  LoadingSpinner,
  LoadingOverlay,
  ButtonSpinner,
  Skeleton,
  CardSkeleton,
  TableRowSkeleton,
  PageLoader,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Badge,
  StatusBadge,
};