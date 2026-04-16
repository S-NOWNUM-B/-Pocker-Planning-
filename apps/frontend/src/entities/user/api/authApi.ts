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
export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', credentials);
  return data;
}

/**
 * Get current authenticated user profile
 */
export async function getUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
