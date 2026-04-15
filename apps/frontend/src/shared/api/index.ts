/**
 * Экспорт API-слоя.
 *
 * api — базовый axios-клиент с интерцепторами.
 * ApiError — типизированная ошибка API (statusCode, error, message).
 */
export { api } from './client';
export type { ApiError } from './client';
