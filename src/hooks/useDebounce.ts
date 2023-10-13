import { useEffect, useRef, useState } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay?: number,
) {
  const [debouncedFunc, setDebouncedFunc] = useState<T>(func);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedFunc(() => func);
      timeoutRef.current = undefined;
    }, delay || 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [func, delay]);

  return debouncedFunc;
}
