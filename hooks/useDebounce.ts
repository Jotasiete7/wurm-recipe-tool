import { useState, useEffect } from 'react';

/**
 * Hook that debounces a value.
 * If the value changes to an empty string, it updates immediately to keep UI snappier.
 *
 * @param value The value to debounce
 * @param delay The debounce timeout in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (value === '') {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
