/**
 * Хук управления темой оформления (тёмная/светлая).
 *
 * Считывает сохранённую тему из localStorage или системные настройки.
 * Переключает класс 'dark' на <html> для CSS-селекторов.
 * Сохраняет выбор в localStorage.
 *
 * @returns { theme, setTheme, toggleTheme, isDark } — текущая тема и методы управления
 */
import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, type Theme } from '../poker';

function readInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light' as Theme;
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
