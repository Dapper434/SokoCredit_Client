import { useState, useEffect } from 'react';

export function useSessionState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = sessionStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save to sessionStorage", e);
    }
  }, [key, state]);

  return [state, setState];
}
