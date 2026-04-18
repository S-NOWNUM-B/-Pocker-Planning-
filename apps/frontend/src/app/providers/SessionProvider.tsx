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
import { getUser as getUserRequest, login as loginRequest, register as registerRequest } from '@/entities/user';
import type { ApiError } from '@/shared/api';
import type { User } from '@/entities/user';
import type { LoginCredentials, RegisterCredentials } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

const parseApiErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }

  return 'Произошла ошибка. Попробуйте позже.';
};

export interface SessionContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRegisteredUsers: boolean;
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
  const [hasRegisteredUsers, setHasRegisteredUsers] = useState(false);

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

        try {
          const currentUser = await getUserRequest();
          setUser(currentUser);
          setHasRegisteredUsers(true);
        } catch {
          SessionManager.removeToken();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const authData = await loginRequest(credentials);
      SessionManager.saveToken(authData.access_token);
      setUser(authData.user);
      setHasRegisteredUsers(true);
    } catch (error) {
      throw new Error(parseApiErrorMessage(error));
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      const authData = await registerRequest(credentials);
      SessionManager.saveToken(authData.access_token);
      setUser(authData.user);
      setHasRegisteredUsers(true);
    } catch (error) {
      throw new Error(parseApiErrorMessage(error));
    }
  };

  const handleLogout = () => {
    SessionManager.removeToken();
    setUser(null);
  };

  const value: SessionContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    hasRegisteredUsers,
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
