/**
 * Barrel-экспорт сущности «Пользователь».
 *
 * Экспортирует:
 *  - authApi — REST API для авторизации (login, register, logout, getUser и т.д.)
 *  - User, LoginCredentials, RegisterCredentials, AuthTokens — типы данных
 */
export * from './api/authApi';
export * from './model/types';
