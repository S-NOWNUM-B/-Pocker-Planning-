import { api } from '@/shared/api';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
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
export async function register(_credentials: RegisterCredentials): Promise<RegisterResponse> {
  throw new Error('Регистрация временно отключена. Реализуйте вручную.');
}

/**
 * Get current authenticated user profile
 */
export async function getUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
