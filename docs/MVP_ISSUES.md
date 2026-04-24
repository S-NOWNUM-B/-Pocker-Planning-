# Проблемы и недостатки MVP

> Дата анализа: 2026-04-24

Документ содержит детальное описание проблем, которые необходимо решить для полноценного MVP приложения Poker Planning.

---

## 🔴 Критичные недостатки

### 1. Отсутствует WebSocket на фронтенде

**Проблема:**
- Backend имеет полноценный WebSocket endpoint (`/ws/rooms/{room_id}`)
- Фронтенд использует только HTTP polling с интервалом 4 секунды (`refetchInterval: 4000`)
- Участники видят изменения с задержкой до 4 секунд, что критично для real-time голосования

**Текущая реализация:**
```typescript
// apps/frontend/src/pages/RoomPage/ui/RoomPage.tsx:42
const roomQuery = useQuery({
  queryKey: ['room', resolvedRoomRef, user?.id ?? 'guest', roomAccessToken ?? 'no-token'],
  enabled: Boolean(user || roomAccessToken),
  queryFn: () => loadRoomSnapshotWithToken(resolvedRoomRef, roomAccessToken),
  refetchInterval: 4000, // ❌ Polling вместо WebSocket
});
```

**Что нужно:**
- Подключить WebSocket в RoomPage через хук `useWebSocket`
- Слушать события от backend:
  - `round.started` — новый раунд начат
  - `vote.submitted` — кто-то проголосовал
  - `round.revealed` — карты раскрыты
  - `round.finalized` — результат сохранён
  - `presence.changed` — участник зашёл/вышел
- При получении события вызывать `queryClient.invalidateQueries(['room', ...])`
- Отправлять `presence.ping` каждые 30 секунд для поддержания соединения

**Backend API:**
```python
# apps/backend/app/api/routes/ws.py:15
@router.websocket("/ws/rooms/{room_id}")
async def room_websocket(websocket: WebSocket, room_id: UUID) -> None:
    # Требует token в query params: ?token=<jwt>
    # Отправляет события типа:
    # {"type": "round.started", "data": {...}}
```

**Приоритет:** 🔴 Критичный

---

### 2. Нет функции удаления задач

**Проблема:**
- Пользователь может добавить задачу с опечаткой или дубликат
- Нет способа удалить ошибочную задачу
- TaskSidebar показывает все задачи без возможности управления

**Текущая реализация:**
```typescript
// apps/frontend/src/widgets/TaskSidebar/ui/TaskSidebar.tsx
// Есть только onAddTask, нет onDeleteTask
```

**Что нужно:**
1. **Backend:** Добавить endpoint `DELETE /rooms/{room_id}/tasks/{task_id}`
   - Проверка прав: только owner может удалять
   - Нельзя удалить задачу с активным раундом
   - Нельзя удалить задачу с сохранённым результатом (или спросить подтверждение)

2. **Frontend:**
   - Добавить иконку корзины рядом с каждой задачей в TaskSidebar
   - Показывать confirmation dialog перед удалением
   - Обновить UI после успешного удаления

**Приоритет:** 🔴 Критичный

---

### 3. Нет редактирования задач

**Проблема:**
- Опечатка в названии задачи не исправляется
- Приходится удалять и создавать заново (но удаления тоже нет)

**Что нужно:**
1. **Backend:** `PATCH /rooms/{room_id}/tasks/{task_id}`
   - Поля: `title`, `description`
   - Только owner может редактировать
   - Нельзя редактировать оценённую задачу (или только description)

2. **Frontend:**
   - Inline editing в TaskSidebar (двойной клик на задачу)
   - Или модальное окно с формой редактирования
   - Сохранение по Enter, отмена по Escape

**Приоритет:** 🟡 Средний

---

### 4. Отсутствует кнопка "Переголосовать"

**Проблема:**
- После reveal можно только "Следующая задача"
- Если команда не согласна с результатом, нужно переголосовать
- Backend API `POST /{round_id}/reset` существует, но не используется

**Backend API:**
```python
# apps/backend/app/api/routes/voting.py:63
@router.post("/{round_id}/reset", response_model=RoomSnapshotResponse)
async def reset_round(room_id: UUID, round_id: UUID, ...) -> RoomSnapshotResponse:
    # Отменяет текущий раунд и создаёт новый для той же задачи
```

**Что нужно:**
1. **Frontend:** Добавить кнопку "Переголосовать" в RoomResults рядом с "Следующая задача"
2. Вызывать `roomApi.resetRound(roomId, roundId, roomAccessToken)`
3. После reset все голоса сбрасываются, участники голосуют заново

**Приоритет:** 🔴 Критичный

---

### 5. Нет индикации онлайн-статуса участников

**Проблема:**
- Backend отслеживает presence через WebSocket (`touch_presence`, `presence.changed`)
- Фронтенд получает `online_participant_ids` в snapshot, но не отображает
- Непонятно, кто сейчас в комнате, а кто отключился

**Backend данные:**
```python
# apps/backend/app/services/room_state_service.py
# RoomSnapshotResponse содержит:
# - participants: List[ParticipantSchema]
# - online_participant_ids: List[UUID]  # ← не используется на фронте
```

**Что нужно:**
1. **Frontend:** В ParticipantsList добавить зелёную точку рядом с аватаром онлайн-участников
2. Проверять `snapshot.online_participant_ids.includes(player.id)`
3. Серые/приглушённые карточки для офлайн-участников

**Приоритет:** 🟡 Средний

---

### 6. Отсутствует история голосований

**Проблема:**
- Нельзя посмотреть прошлые раунды по задаче
- Нет страницы с результатами всех оценённых задач
- Данные есть в БД (`voting_rounds`, `voting_results`), но нет UI

**Что нужно:**
1. **Backend:** `GET /rooms/{room_id}/history`
   - Возвращает список задач с результатами
   - Для каждой задачи: все раунды, голоса, финальная оценка

2. **Frontend:**
   - Новая страница `/rooms/{roomId}/history`
   - Или модальное окно "История" в RoomPage
   - Таблица: Задача | Раунды | Голоса | Итог | Дата

**Приоритет:** 🟡 Средний

---

## 🟠 Проблемы UX

### 7. Нет подтверждения при выходе из комнаты

**Проблема:**
- Случайный клик на "Назад" или закрытие вкладки уводит из комнаты
- Потеря контекста, особенно для гостей (нет истории комнат)

**Что нужно:**
1. Добавить `beforeunload` event listener
2. Показывать браузерное предупреждение: "Вы уверены, что хотите покинуть комнату?"
3. Для SPA-навигации: React Router `useBlocker` или confirmation dialog

**Приоритет:** 🟢 Низкий

---

### 8. Отсутствует копирование invite link

**Проблема:**
- RoomHeader показывает invite link, но нет кнопки "Скопировать"
- Пользователь должен вручную выделять и копировать

**Текущая реализация:**
```typescript
// apps/frontend/src/widgets/RoomHeader/ui/RoomHeader.tsx
// Есть inviteLink prop, но нет кнопки копирования
```

**Что нужно:**
1. Добавить кнопку с иконкой "Copy" рядом со ссылкой
2. Использовать `navigator.clipboard.writeText(inviteLink)`
3. Показать toast "Ссылка скопирована" после успешного копирования
4. Fallback для старых браузеров (создать временный input, select, copy, remove)

**Приоритет:** 🔴 Критичный

---

### 9. Нет уведомлений/тостов

**Проблема:**
- При ошибках API пользователь не видит, что пошло не так
- Нет feedback при успешных действиях (задача добавлена, голос принят)
- Мутации молча падают, пользователь не понимает, сработало ли действие

**Что нужно:**
1. Подключить библиотеку toast-уведомлений (react-hot-toast, sonner)
2. Обрабатывать ошибки в `onError` мутаций:
   ```typescript
   const createTaskMutation = useMutation({
     mutationFn: ...,
     onSuccess: () => toast.success('Задача добавлена'),
     onError: (error) => toast.error(error.message),
   });
   ```
3. Показывать уведомления для:
   - Успешное добавление задачи
   - Голос принят
   - Карты раскрыты
   - Ошибки сети / 403 / 404

**Приоритет:** 🔴 Критичный

---

### 10. Нет loading состояний для кнопок

**Проблема:**
- Кнопки блокируются через `disabled={isBusy}`, но нет спиннера
- Непонятно, обрабатывается ли действие или кнопка просто неактивна

**Текущая реализация:**
```typescript
// apps/frontend/src/pages/RoomPage/ui/RoomPage.tsx:134
const isBusy = createTaskMutation.isPending || selectTaskMutation.isPending || ...;
// Используется только для disabled, нет визуального feedback
```

**Что нужно:**
1. Добавить `isLoading` prop в компонент Button
2. Показывать спиннер внутри кнопки при loading
3. Отключать pointer-events и менять opacity

**Приоритет:** 🟡 Средний

---

### 11. Отсутствует таймер раунда

**Проблема:**
- Нельзя ограничить время на голосование
- Нет визуального countdown для создания urgency
- Раунд может висеть бесконечно

**Что нужно:**
1. **Backend:** Добавить `duration_seconds` в `VotingRound`
2. **Frontend:**
   - Показывать countdown в RoomResults
   - Автоматически reveal по истечении времени (или уведомление owner)
   - Настройка таймера при создании комнаты (опционально)

**Приоритет:** 🟢 Низкий (nice-to-have)

---

### 12. Нет фильтрации задач

**Проблема:**
- При большом количестве задач (20+) неудобно искать нужную
- Нет разделения на "Оценённые" / "Не оценённые"
- Нет поиска по названию

**Что нужно:**
1. Добавить табы в TaskSidebar: "Все" / "Не оценённые" / "Оценённые"
2. Поле поиска над списком задач (фильтрация по `task.title`)
3. Сортировка: по дате создания / по алфавиту / по статусу

**Приоритет:** 🟢 Низкий

---

## ⚙️ Технические улучшения

### 13. Нет обработки переподключения WebSocket

**Проблема:**
- При обрыве соединения (сеть пропала, сервер перезапустился) WebSocket не восстанавливается
- Пользователь остаётся без real-time обновлений

**Что нужно:**
1. В `useWebSocket` хуке добавить логику reconnect:
   - Exponential backoff (1s, 2s, 4s, 8s, max 30s)
   - Максимум 10 попыток
   - После успешного reconnect отправить `room.sync_request`
2. Показывать banner "Соединение потеряно, переподключение..."
3. Fallback на polling, если WebSocket недоступен

**Приоритет:** 🟡 Средний

---

### 14. Отсутствует оптимистичное обновление UI

**Проблема:**
- После голосования UI обновляется только после refetch (4 сек задержка)
- Пользователь не видит мгновенного feedback

**Что нужно:**
1. Использовать `onMutate` в TanStack Query для оптимистичных обновлений:
   ```typescript
   const voteMutation = useMutation({
     mutationFn: ...,
     onMutate: async (variables) => {
       await queryClient.cancelQueries(['room', ...]);
       const previous = queryClient.getQueryData(['room', ...]);
       queryClient.setQueryData(['room', ...], (old) => {
         // Обновить snapshot локально
       });
       return { previous };
     },
     onError: (err, variables, context) => {
       // Откатить изменения
       queryClient.setQueryData(['room', ...], context.previous);
     },
   });
   ```

**Приоритет:** 🟡 Средний

---

### 15. Нет валидации длины названия задачи

**Проблема:**
- Backend ограничивает 240 символов (`String(240)`)
- Фронтенд не предупреждает, пользователь получает ошибку после submit

**Что нужно:**
1. Добавить `maxLength={240}` в Input для новой задачи
2. Показывать счётчик символов: "235/240"
3. Блокировать кнопку добавления при превышении лимита

**Приоритет:** 🟢 Низкий

---

## 📊 Приоритизация

### Для минимального MVP (Must Have):
1. ✅ WebSocket на фронтенде (#1)
2. ✅ Кнопка "Переголосовать" (#4)
3. ✅ Копирование invite link (#8)
4. ✅ Toast-уведомления (#9)
5. ✅ Удаление задач (#2)

### Для улучшенного MVP (Should Have):
6. Редактирование задач (#3)
7. Индикация онлайн-статуса (#5)
8. Loading состояния кнопок (#10)
9. Обработка reconnect WebSocket (#13)

### Для полноценного продукта (Nice to Have):
10. История голосований (#6)
11. Подтверждение выхода (#7)
12. Оптимистичные обновления (#14)
13. Таймер раунда (#11)
14. Фильтрация задач (#12)
15. Валидация длины (#15)