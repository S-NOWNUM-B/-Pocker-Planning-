/**
 * SessionManager — управление сессией пользователя в localStorage.
 *
 * Отвечает за:
 *  - Сохранение access_token после авторизации
 *  - Восстановление токена при загрузке приложения
 *  - Удаление токена при выходе
 *  - Проверку наличия авторизованного пользователя
 */

const TOKEN_KEY = 'access_token';
const SESSION_CHANGE_EVENT = 'poker-planning:session-change';

type SessionChangeDetail = {
  user?: unknown;
};

function notifySessionChange(detail: SessionChangeDetail = {}) {
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT, { detail }));
}

export const SessionManager = {
  // Сохранить токен в localStorage
  saveToken: (token: string, user?: unknown) => {
    localStorage.setItem(TOKEN_KEY, token);
    notifySessionChange({ user });
  },

  // Получить токен из localStorage
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Проверить, есть ли токен (т.е. авторизован ли пользователь)
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Удалить токен из localStorage (выход)
  removeToken: (options?: { notify?: boolean }) => {
    localStorage.removeItem(TOKEN_KEY);
    if (options?.notify !== false) {
      notifySessionChange({ user: null });
    }
  },

  // Событие для подписки на изменения сессии в UI
  SESSION_CHANGE_EVENT,
};
