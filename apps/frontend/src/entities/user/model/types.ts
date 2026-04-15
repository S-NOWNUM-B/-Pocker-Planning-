/**
 * Типы данных сущности «Пользователь» и авторизации.
 *
 * User — профиль пользователя (id, email, name, avatarUrl).
 * LoginCredentials / RegisterCredentials — данные для входа/регистрации.
 * AuthTokens — пара access/refresh токенов с TTL.
 * LoginResponse / RegisterResponse — ответ сервера при авторизации.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}
