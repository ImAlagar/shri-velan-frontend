// utils/toast.js
import { toast } from 'react-hot-toast';

// Success toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#10b981',
    },
    ...options,
  });
};

// Error toast
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

// Warning toast
export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    icon: '⚠️',
    ...options,
  });
};

// Info toast
export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    icon: 'ℹ️',
    ...options,
  });
};

// Loading toast
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6b7280',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

// Promise toast for async operations
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'top-right',
      style: {
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    }
  );
};

// Custom toast
export const showCustom = (message, options = {}) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {options.icon || '🔔'}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
            {options.description && (
              <p className="mt-1 text-sm text-gray-500">
                {options.description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};