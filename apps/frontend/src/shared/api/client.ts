/**
 * Базовый HTTP-клиент на основе axios.
 *
 * Настройки:
 *  - baseURL берётся из VITE_API_URL (по умолчанию localhost:3000/api)
 *  - Заголовок Content-Type: application/json
 *  - Request interceptor: добавляет Authorization header с токеном
 *  - Response interceptor: преобразует ошибки axios в типизированный ApiError
 *
 * Используется во всех API-модулях (entities/api).
 */
import axios from 'axios';
import type { ApiError } from '@poker/shared';
import { SessionManager } from '@/shared/lib/session';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = SessionManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    const apiError: ApiError = {
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || 'Unknown error',
      message: error.response?.data?.message || (typeof detail === 'string' ? detail : error.message),
    };
    return Promise.reject(apiError);
  },
);

export type { ApiError };
