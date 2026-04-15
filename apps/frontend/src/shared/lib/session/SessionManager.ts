/**
 * Менеджер JWT-сессий.
 *
 * Отвечает за хранение, обновление и проверку токенов авторизации.
 *
 * Будущая реализация:
 *  - isAuthenticated() — проверка наличия валидного access-токена
 *  - getAccessToken() — получение текущего токена (с авто-refresh при истечении)
 *  - setTokens(accessToken, refreshToken, expiresIn) — сохранение после входа
 *  - refresh() — запрос нового токена через /auth/refresh
 *  - clear() — очистка при выходе из аккаунта
 *  - onTokenExpired(callback) — подписка на событие истечения токена
 *
 * Хранение: localStorage для refresh-токена, memory для access-токена.
 */
export function SessionManager() {
  // TODO: Управление JWT-токенами — хранение, refresh, проверка срока действия
  return null;
}
