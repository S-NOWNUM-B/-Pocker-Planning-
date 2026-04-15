import { api } from '@/shared/api';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  LoginResponse,
  RegisterResponse,
} from '../model/types';

/**
 * Authenticate user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
}

/**
 * Register a new user
 */
export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', credentials);
  return data;
}

/**
 * Logout current user and invalidate tokens
 */
export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
  return data;
}

/**
 * Get current authenticated user profile
 */
export async function getUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

/**
 * Update user profile
 */
export async function updateUser(
  updates: Partial<Pick<User, 'name' | 'avatarUrl'>>,
): Promise<User> {
  const { data } = await api.patch<User>('/auth/profile', updates);
  return data;
}
