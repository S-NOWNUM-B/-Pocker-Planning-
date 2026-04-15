/**
 * Хук для реактивной работы с localStorage.
 *
 * Сохраняет и считывает значение из localStorage по ключу.
 * Поддерживает функциональное обновление (как useState).
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * @param key — ключ в localStorage
 * @param initialValue — значение по умолчанию
 * @returns [storedValue, setValue] — текущее значение и сеттер
 */
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}
