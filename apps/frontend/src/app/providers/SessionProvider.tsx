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
import {
  getUser as getUserRequest,
  login as loginRequest,
  register as registerRequest,
} from '@/entities/user';
import type { ApiError } from '@/shared/api';
import type { User } from '@/entities/user';
import type { LoginCredentials, RegisterCredentials } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

// Функция для извлечения сообщения об ошибке из ответа API
const parseApiErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }

  return 'Произошла ошибка. Попробуйте позже.';
};

// Интерфейс для значения контекста сессии
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

// Создаём контекст с начальным значением undefined
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// Провайдер сессии, который оборачивает приложение и предоставляет контекст
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRegisteredUsers, setHasRegisteredUsers] = useState(false);

  const syncSession = async () => {
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
      SessionManager.removeToken({ notify: false });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Инициализация сессии при загрузке приложения
  useEffect(() => {
    void syncSession();

    const handleSessionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ user?: User | null }>).detail;

      if (detail && 'user' in detail) {
        setUser(detail.user ?? null);
        setHasRegisteredUsers(Boolean(detail.user));
        setIsLoading(false);
        return;
      }

      void syncSession();
    };

    window.addEventListener(SessionManager.SESSION_CHANGE_EVENT, handleSessionChange);

    return () => {
      window.removeEventListener(SessionManager.SESSION_CHANGE_EVENT, handleSessionChange);
    };
  }, []);

  // Вход в аккаунт — сохраняем токен и профиль
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const authData = await loginRequest(credentials);
      SessionManager.saveToken(authData.access_token, authData.user);
      setUser(authData.user);
      setHasRegisteredUsers(true);
    } catch (error) {
      throw new Error(parseApiErrorMessage(error));
    }
  };

  // Регистрация нового пользователя — сохраняем токен и профиль
  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      const authData = await registerRequest(credentials);
      SessionManager.saveToken(authData.access_token, authData.user);
      setUser(authData.user);
      setHasRegisteredUsers(true);
    } catch (error) {
      throw new Error(parseApiErrorMessage(error));
    }
  };

  // Выход из аккаунта — удаляем токен и сбрасываем профиль
  const handleLogout = () => {
    SessionManager.removeToken();
    setUser(null);
  };

  // Значение, предоставляемое через контекст
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

// Хук для доступа к сессии из компонентов
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
