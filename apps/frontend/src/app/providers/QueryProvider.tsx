/**
 * Корневой провайдер приложения.
 *
 * Оборачивает всё приложение в:
 *  - QueryClientProvider (TanStack Query) — для серверного состояния
 *  - BrowserRouter (react-router-dom) — для клиентской маршрутизации
 *
 * Используется в main.tsx как обёртка над <App />.
 *
 * @param children — дочерние компоненты (обычно <App />)
 */
import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@/shared/config';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
