import { useCallback, useEffect, useState } from 'react';

type StorageKey = 'isLoggedIn';

export function useLocalStorage(key: StorageKey, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      console.log({ item });
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log('HERE');
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : undefined);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = useCallback((value: any) => {
    console.log('setting value', value);
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log({ storedValue });

  return [storedValue, setValue];
}
