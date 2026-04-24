# WebSocket Implementation - Completed

> Дата: 2026-04-24

## Выполненные изменения

### 1. Обновлен базовый хук `useWebSocket`
**Файл:** `apps/frontend/src/shared/lib/hooks/useWebSocket.ts`

**Изменения:**
- Добавлен `useState` для отслеживания `isConnected` (реактивное состояние)
- Добавлен `onError` callback для обработки ошибок
- Реализован exponential backoff для переподключения (1s → 2s → 4s → 8s → max 30s)
- Добавлен лимит попыток переподключения (`maxReconnectAttempts = 10`)
- Исправлено возвращаемое значение `isConnected` (теперь реактивное)

### 2. Создан специализированный хук `useRoomWebSocket`
**Файл:** `apps/frontend/src/shared/lib/hooks/useRoomWebSocket.ts` (новый)

**Функционал:**
- Автоматическое формирование WebSocket URL с токеном
- Поддержка как HTTP, так и HTTPS (автоматическое определение ws:// или wss://)
- Обработка событий от backend:
  - `presence.changed` — участник зашёл/вышел
  - `round.started` — новый раунд начат
  - `vote.submitted` — кто-то проголосовал
  - `round.revealed` — карты раскрыты
  - `round.finalized` — результат сохранён
  - `room.snapshot` — полный снимок комнаты
- Автоматическая отправка `presence.ping` каждые 30 секунд
- Инвалидация React Query кэша при получении событий

### 3. Интегрирован WebSocket в `RoomPage`
**Файл:** `apps/frontend/src/pages/RoomPage/ui/RoomPage.tsx`

**Изменения:**
- Добавлен импорт `SessionManager` для получения JWT токена
- Добавлен импорт `useRoomWebSocket`
- Получение токена: для авторизованных пользователей — из SessionManager, для гостей — roomAccessToken
- Подключение WebSocket при наличии roomId и токена
- Изменён `refetchInterval`: 10 секунд вместо 4 (fallback на случай недоступности WebSocket)

### 4. Обновлен экспорт хуков
**Файл:** `apps/frontend/src/shared/lib/hooks/index.ts`

**Изменения:**
- Добавлен экспорт `useRoomWebSocket`

## Как это работает

1. **При входе в комнату:**
   - RoomPage получает JWT токен (из SessionManager или roomAccessToken)
   - useRoomWebSocket формирует URL: `ws://localhost:8000/api/v1/ws/rooms/{roomId}?token={jwt}`
   - Устанавливается WebSocket соединение

2. **При получении события:**
   - Backend отправляет JSON: `{"type": "vote.submitted", "payload": {...}}`
   - useRoomWebSocket обрабатывает событие и инвалидирует React Query кэш
   - UI автоматически обновляется через refetch

3. **Поддержание соединения:**
   - Каждые 30 секунд отправляется `{"type": "presence.ping"}`
   - Backend обновляет timestamp последней активности участника

4. **При обрыве соединения:**
   - Автоматическое переподключение с exponential backoff
   - Максимум 10 попыток (1s, 2s, 4s, 8s, 16s, 30s, 30s, 30s, 30s, 30s)
   - Fallback на HTTP polling (каждые 10 секунд)

## Тестирование

### Проверка подключения:
1. Запустить backend: `cd apps/backend && python -m app.main`
2. Запустить frontend: `cd apps/frontend && npm run dev`
3. Открыть комнату в браузере
4. В консоли должно появиться: `WebSocket connected`

### Проверка real-time обновлений:
1. Открыть комнату в двух вкладках
2. В первой вкладке проголосовать
3. Во второй вкладке должен мгновенно обновиться UI (без задержки в 4 секунды)

### Проверка переподключения:
1. Открыть комнату
2. Остановить backend
3. В консоли должны появиться попытки переподключения
4. Запустить backend снова
5. Соединение должно восстановиться автоматически

## Что осталось сделать (из MVP_ISSUES.md)

### Минимальный MVP (Must Have):
- ✅ WebSocket на фронтенде (#1) — **ВЫПОЛНЕНО**
- ⏳ Кнопка "Переголосовать" (#4)
- ⏳ Копирование invite link (#8)
- ⏳ Toast-уведомления (#9)
- ⏳ Удаление задач (#2)

### Улучшенный MVP (Should Have):
- ⏳ Редактирование задач (#3)
- ⏳ Индикация онлайн-статуса (#5)
- ⏳ Loading состояния кнопок (#10)
- ⏳ Обработка reconnect WebSocket (#13) — **ЧАСТИЧНО ВЫПОЛНЕНО** (exponential backoff добавлен)

## Технические детали

### Backend WebSocket API
**Endpoint:** `ws://localhost:8000/api/v1/ws/rooms/{room_id}?token={jwt}`

**Входящие события (от клиента):**
- `presence.ping` — поддержание соединения
- `room.sync_request` — запрос полного снимка комнаты

**Исходящие события (от сервера):**
- `presence.changed` — изменение онлайн-статуса участников
- `round.started` — начат новый раунд
- `vote.submitted` — получен голос
- `round.revealed` — карты раскрыты
- `round.finalized` — результат сохранён
- `room.snapshot` — полный снимок комнаты
- `error` — ошибка

### Структура события
```typescript
{
  "type": "vote.submitted",
  "payload": {
    // данные события
  }
}
```

## Известные ограничения

1. **Fallback на polling:** При недоступности WebSocket используется HTTP polling каждые 10 секунд (вместо 4)
2. **Максимум попыток:** После 10 неудачных попыток переподключения WebSocket отключается
3. **Токен в URL:** JWT токен передаётся в query параметре (безопасно для WSS, но видим в логах)

## Файлы изменены

- `apps/frontend/src/shared/lib/hooks/useWebSocket.ts` — обновлён
- `apps/frontend/src/shared/lib/hooks/useRoomWebSocket.ts` — создан
- `apps/frontend/src/shared/lib/hooks/index.ts` — обновлён
- `apps/frontend/src/pages/RoomPage/ui/RoomPage.tsx` — обновлён
