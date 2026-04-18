import { create } from 'zustand';
import type { IUser, ILoginCredentails } from './types';
import { SessionManager } from '@/shared/lib/session';
import { userAPI } from '../api/authApi';

// Создание Zustand стора для управления состоянием пользователя
interface UserState {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;

  // Метод для логина пользователя
  login: (credentials: ILoginCredentails) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Инициализация Zustand стора
export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuth: false,
  isLoading: false,

  // Метод для логина пользователя
  login: async (credentials: ILoginCredentails) => {
    set({ isLoading: true }); // Установка флага загрузки
    try {
      const data = await userAPI.login(credentials); // Вызов API для логина
      SessionManager.saveToken(data.access_token); // Сохранение токена в SessionManager
      set({ user: data.user, isAuth: true }); // Обновление состояния пользователя и флага аутентификации
    } finally {
      set({ isLoading: false }); // Сброс флага загрузки после завершения операции
    }
  },

  logout: () => {
    SessionManager.removeToken();
    set({ user: null, isAuth: false }); // Сброс состояния пользователя и флага аутентификации
  },

  checkAuth: async () => {
    const token = SessionManager.getToken(); // Получение токена из SessionManager
    if (!token) return; // Если токена нет, выходим из функции

    set({ isLoading: true }); // Установка флага загрузки
    try {
      const data = await userAPI.getMe(); // Вызов API для получения информации о текущем пользователе
      set({ user: data, isAuth: true }); // Обновление состояния пользователя и флага аутентификации
    } catch (_error) {
      // Обработка ошибок при проверке аутентификации
      SessionManager.removeToken(); // Удаление токена при ошибке
      set({ user: null, isAuth: false }); // Сброс состояния пользователя и флага аутентификации
    } finally {
      set({ isLoading: false }); // Сброс флага загрузки после завершения операции
    }
  },
}));
