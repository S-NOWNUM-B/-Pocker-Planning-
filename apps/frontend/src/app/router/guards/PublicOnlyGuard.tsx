import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface PublicOnlyGuardProps {
  children: ReactNode;
}

/**
 * Guard для публичных маршрутов, доступных только неавторизованным.
 *
 * Проверяет, что пользователь НЕ авторизован.
 * Если уже вошёл в систему — перенаправляет на /dashboard.
 * Если не авторизован — рендерит дочерние компоненты (login, register).
 *
 * Используется для предотвращения повторного входа
 * уже авторизованного пользователя.
 */
export function PublicOnlyGuard({ children }: PublicOnlyGuardProps) {
  // TODO: Проверить, что пользователь НЕ авторизован
  // Если авторизован — редирект на /dashboard
  // Если не авторизован — рендерить дочерние компоненты
  return <>{children}</>;
}
