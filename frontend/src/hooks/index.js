// ============================================
// HMITLC LMS - Custom Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';

// useLocalStorage Hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// useDebounce Hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// useToggle Hook
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
};

// useAsync Hook
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setStatus('pending');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  };
};

// usePagination Hook
export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPagination,
    offset: (page - 1) * pageSize,
  };
};

// useFormField Hook - for form validation
export const useFormField = (initialValue, validationFn) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (newValue) => {
      if (validationFn) {
        const result = validationFn(newValue);
        setError(result);
        return !result;
      }
      return true;
    },
    [validationFn]
  );

  const onChange = useCallback(
    (newValue) => {
      setValue(newValue);
      if (touched) {
        validate(newValue);
      }
    },
    [touched, validate]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    validate(value);
  }, [validate, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    onChange,
    onBlur,
    setValue,
    reset,
    isValid: !error,
  };
};

export default {
  useLocalStorage,
  useDebounce,
  useToggle,
  useAsync,
  usePagination,
  useFormField,
};