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
import type { LoginCredentials, RegisterCredentials } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

const MOCK_USERS_KEY = 'mock_auth_users';
const CURRENT_USER_KEY = 'mock_current_user';

interface StoredUser {
  user: User;
  password: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const readCurrentUser = (): User | null => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

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

        const currentUser = readCurrentUser();
        if (!currentUser) {
          SessionManager.removeToken();
          setUser(null);
          return;
        }

        setUser(currentUser);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    await wait(250);

    const users = readUsers();
    const matched = users.find(
      (item) =>
        item.user.email.toLowerCase() === credentials.email.toLowerCase() &&
        item.password === credentials.password,
    );

    if (!matched) {
      throw new Error('Неверный email или пароль');
    }

    SessionManager.saveToken(`mock-token-${matched.user.id}`);
    saveCurrentUser(matched.user);
    setUser(matched.user);
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    await wait(250);

    const users = readUsers();
    const alreadyExists = users.some(
      (item) => item.user.email.toLowerCase() === credentials.email.toLowerCase(),
    );

    if (alreadyExists) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: credentials.email,
      username: credentials.username,
      createdAt: new Date().toISOString(),
    };

    const nextUsers: StoredUser[] = [...users, { user: newUser, password: credentials.password }];
    saveUsers(nextUsers);

    SessionManager.saveToken(`mock-token-${newUser.id}`);
    saveCurrentUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    SessionManager.removeToken();
    localStorage.removeItem(CURRENT_USER_KEY);
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
