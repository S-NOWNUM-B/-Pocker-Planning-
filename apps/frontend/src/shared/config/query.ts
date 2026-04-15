/**
 * Конфигурация TanStack Query (React Query).
 *
 * QueryClient с настройками по умолчанию:
 *  - staleTime: 5 минут — данные считаются свежими 5 минут
 *  - retry: 2 — повтор запроса при ошибке 2 раза
 *  - refetchOnWindowFocus: false — не обновлять при фокусе окна
 *
 * Используется в AppProviders для обёртки всего приложения.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
