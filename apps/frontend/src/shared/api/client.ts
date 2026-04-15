/**
 * Базовый HTTP-клиент на основе axios.
 *
 * Настройки:
 *  - baseURL берётся из VITE_API_URL (по умолчанию localhost:3000/api)
 *  - Заголовок Content-Type: application/json
 *  - Интерцептор ответа: преобразует ошибки axios в типизированный ApiError
 *
 * Используется во всех API-модулях (entities/api).
 */
import axios from 'axios';
import type { ApiError } from '@poker/shared';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || 'Unknown error',
      message: error.response?.data?.message || error.message,
    };
    return Promise.reject(apiError);
  },
);

export type { ApiError };
