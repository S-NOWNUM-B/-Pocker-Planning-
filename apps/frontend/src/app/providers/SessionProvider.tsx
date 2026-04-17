/**
 * SessionContext — состояние сессии приложения.
 *
 * Предоставляет:
 *  - user — текущий авторизованный пользователь (или null)
 *  - isLoading — идёт ли инициализация приложения при старте
 *  - login — функция для входа
 *  - logout — функция для выхода
 *  - setUser — прямое обновление профиля пользователя (для обновления данных)
 *
 * Используется в SessionProvider для оборачивания приложения.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/entities/user';
import { login as apiLogin, getUser as apiGetUser } from '@/entities/user';
import type { LoginCredentials, RegisterCredentials } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

export interface SessionContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

/**
 * SessionProvider — инициализирует сессию и управляет состоянием авторизации.
 *
 * При загрузке приложения:
 *  1. Проверяет наличие токена в localStorage
 *  2. Восстанавливает профиль пользователя из localStorage или API
 *  3. Устанавливает isLoading = false, чтобы приложение начало отрисовку
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация сессии при загрузке приложения
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Проверим, есть ли сохранённый токен
        const token = SessionManager.getToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Попробуем получить сохранённый профиль из localStorage
        const savedUser = SessionManager.getUser();
        if (savedUser) {
          setUser(savedUser);
          setIsLoading(false);
          return;
        }

        // Если профиля нет в localStorage, восстановим его из API
        try {
          const currentUser = await apiGetUser();
          setUser(currentUser);
          SessionManager.saveSession(token, currentUser);
        } catch {
          // Если API вернул ошибку (токен истёк), очистим сессию
          SessionManager.clearSession();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    SessionManager.saveSession(response.access_token, response.user);
    setUser(response.user);
  };

  const handleRegister = async (_credentials: RegisterCredentials) => {
    throw new Error('Регистрация временно отключена. Реализуйте вручную.');
  };

  const handleLogout = () => {
    SessionManager.clearSession();
    setUser(null);
  };

  const value: SessionContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    setUser,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/**
 * Hook для использования сессии в компонентах.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useSession();
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
