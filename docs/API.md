<div align="center">

# Poker Planning API

**Технический справочник по REST API и WebSocket платформы**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![REST](https://img.shields.io/badge/REST-HTTP-2B5BA8)](https://developer.mozilla.org/en-US/docs/Web/HTTP)
[![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-010101)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

</div>

---

## Содержание

- [Базовые сведения](#базовые-сведения)
- [Источники истины](#источники-истины)
- [Основные группы эндпоинтов](#основные-группы-эндпоинтов)
- [WebSocket события](#websocket-события)
- [Контракты ответов и ошибок](#контракты-ответов-и-ошибок)

---

## Базовые сведения

<div align="center">

| **Параметр**            | **Значение**                   |
| :---------------------- | :----------------------------- |
| Базовый префикс         | `http://localhost:8000/api/v1` |
| WebSocket endpoint      | `ws://localhost:8000/ws`       |
| Формат запросов/ответов | `application/json`             |
| Текущая версия          | `v1`                           |

</div>

---

## Источники истины

Источником истины для endpoint являются backend-контракты и их runtime-реализация в `apps/backend/app/api/routes/`.

<div align="center">

| **Контракт**      | **Источник**                              |
| :---------------- | :---------------------------------------- |
| REST API          | `apps/backend/app/api/routes/` (FastAPI роуты) |
| WebSocket события | `apps/backend/app/websocket/` (WS handlers) |
| Pydantic схемы    | `apps/backend/app/schemas/` (DTO модели) |

</div>

Если есть расхождения между этим файлом и backend-контрактами, приоритет у backend.

### Автоматическая документация

FastAPI предоставляет встроенную документацию:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

## Основные группы эндпоинтов

<div align="center">

| **Группа**           | **Файл**                                     | **Назначение**                                         |
| :------------------- | :------------------------------------------- | :----------------------------------------------------- |
| `auth`               | `app/api/routes/auth.py`                     | Регистрация, вход, JWT токены                          |
| `rooms`              | `app/api/routes/rooms.py`                    | Создание/удаление комнат, подключение/выход участников |
| `invitations`        | `app/api/routes/invitation_links.py`         | Ссылки-приглашения для подключения к комнатам          |
| `voting`             | `app/api/routes/voting.py`                   | Раунды голосования, отправка голосов, результаты       |
| `ws`                 | `app/api/routes/ws.py`                       | WebSocket для real-time синхронизации                  |

</div>

---

## WebSocket события

### Клиент → Сервер

<div align="center">

| **Событие**    | **Данные**                      | **Назначение**                   |
| :------------- | :------------------------------ | :------------------------------- |
| `join_room`    | `{ roomId, userId }`            | Присоединение к комнате          |
| `leave_room`   | `{ roomId, userId }`            | Покидание комнаты                |
| `player_vote`  | `{ roomId, userId, cardValue }` | Отправка голоса                  |
| `reveal_votes` | `{ roomId }`                    | Открытие результатов (модератор) |
| `reset_votes`  | `{ roomId }`                    | Сброс голосования (модератор)    |
| `start_round`  | `{ roomId, taskName }`          | Начало нового раунда (модератор) |

</div>

### Сервер → Клиент

<div align="center">

| **Событие**     | **Данные**                                   | **Назначение**                          |
| :-------------- | :------------------------------------------- | :-------------------------------------- |
| `player_voted`  | `{ roomId, userId }`                         | Игрок проголосовал (без значения карты) |
| `all_voted`     | `{ roomId }`                                 | Все игроки проголосовали                |
| `reveal_votes`  | `{ roomId, votes: [{ userId, cardValue }] }` | Результаты голосования                  |
| `player_joined` | `{ roomId, userId, userName }`               | Новый участник в комнате                |
| `player_left`   | `{ roomId, userId }`                         | Участник покинул комнату                |
| `round_started` | `{ roomId, taskName }`                       | Начался новый раунд                     |
| `votes_reset`   | `{ roomId }`                                 | Голосование сброшено                    |
| `error`         | `{ message, code }`                          | Ошибка                                  |

</div>

---

## Контракты ответов и ошибок

<div align="center">

| **Ситуация**     | **HTTP-код**                                            |
| :--------------- | :------------------------------------------------------ |
| Успешный ответ   | `2xx` + JSON                                            |
| Бизнес-ошибка    | `4xx`                                                   |
| Системная ошибка | `5xx`                                                   |
| Пагинация        | `content`, `totalElements`, `totalPages`, `currentPage` |

</div>

Пример успешного ответа:

```json
{
  "id": "room-uuid",
  "name": "Sprint Planning",
  "moderatorId": "user-uuid",
  "participants": [
    { "id": "user-1", "name": "Alice", "hasVoted": true },
    { "id": "user-2", "name": "Bob", "hasVoted": false }
  ],
  "status": "voting",
  "createdAt": "2026-04-07T10:00:00Z"
}
```

Пример тела ошибки:

```json
{
  "timestamp": "2026-04-07T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/rooms/invalid-id"
}
```
