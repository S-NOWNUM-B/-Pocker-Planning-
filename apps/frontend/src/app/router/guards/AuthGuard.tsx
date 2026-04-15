import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Guard для защищённых маршрутов.
 *
 * Проверяет наличие валидного access-токена через SessionManager.
 * Если пользователь не авторизован — перенаправляет на /login.
 * Если авторизован — рендерит дочерние компоненты (dashboard, profile и т.д.).
 *
 * Будущая реализация:
 *  - Проверка токена через SessionManager.isAuthenticated()
 *  - При истёкшем токене — попытка refresh через SessionManager.refresh()
 *  - При неудачном refresh — редирект на /login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  // TODO: Проверить авторизацию через SessionManager
  // Если не авторизован — редирект на /login
  // Если авторизован — рендерить дочерние компоненты
  return <>{children}</>;
}
