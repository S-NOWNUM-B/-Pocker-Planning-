import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Лейаут для страниц авторизации (login, register).
 *
 * Должен содержать:
 *  - Центрированную карточку с формой
 *  - Фоновое оформление с градиентом или паттерном
 *  - Логотип проекта в верхней части
 *  - Ссылку на переключение между входом и регистрацией
 *
 * Используется как обёртка для LoginPage и RegisterPage в роутере.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      {/* TODO: Лейаут авторизации — центрированная карточка, фон, логотип */}
      {children}
    </div>
  );
}
