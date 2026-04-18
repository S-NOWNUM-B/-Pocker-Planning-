/**
 * Типы данных сущности «Пользователь» и авторизации.
 *
 * User — профиль пользователя (id, email, name, avatar_color).
 * LoginCredentials / RegisterCredentials — данные для входа/регистрации.
 * AuthTokens — access токен от сервера.
 * LoginResponse / RegisterResponse — ответ сервера при авторизации.
 */

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar_color: string;
  created_at: string;
}

export interface ILoginCredentails {
  email: string;
  password: string;
}

export interface IRegisterCredentials {
  email: string;
  name: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  access_token: string;
  token_type: 'bearer';
}

export interface IRegisterResponse {
  user: IUser;
  access_token: string;
  token_type: 'bearer';
}

export interface AuthTokens {
  access_token: string;
  token_type: 'bearer';
}

export type User = IUser;
export type LoginCredentials = ILoginCredentails;
export type RegisterCredentials = IRegisterCredentials;
export type LoginResponse = ILoginResponse;
export type RegisterResponse = IRegisterResponse;
