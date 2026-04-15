<div align="center">

# Poker Planning Database

**Документ по модели данных и миграциям backend**

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-FF5733)](https://www.sqlalchemy.org/)
[![Alembic](https://img.shields.io/badge/Alembic-1.15-FF5733)](https://alembic.sqlalchemy.org/)

</div>

---

## Содержание

- [Назначение](#назначение)
- [Ключевые сущности](#ключевые-сущности)
- [Миграции](#миграции)
- [Дополнительно](#дополнительно)
- [Правила изменений схемы](#правила-изменений-схемы)

---

## Назначение

Этот документ фиксирует модель данных на уровне домена.

Исполняемой спецификацией являются SQLAlchemy ORM модели и SQL-миграции в backend. Приоритет у миграций.

---

## Ключевые сущности

<div align="center">

| **Сущность**         | **Таблица**                | **Назначение**                                       | **ORM модель**                   |
| :------------------- | :------------------------- | :--------------------------------------------------- | :------------------------------- |
| Пользователи         | `users`                    | Пользователи и данные аутентификации                 | `app/models/user.py`             |
| Комнаты              | `rooms`                    | Комнаты для сессий планирования                      | `app/models/room.py`             |
| Участники            | `room_participants`        | Участники комнат (связь user ↔ room)                 | `app/models/room_participant.py` |
| Задачи               | `tasks`                    | Задачи/истории для оценки                            | `app/models/task.py`             |
| Пресеты колод        | `deck_presets`             | Системные и кастомные колоды карт                    | `app/models/deck_preset.py`      |
| Ссылки-приглашения   | `invitation_links`         | Ссылки для приглашения участников                    | `app/models/invitation_link.py`  |
| Раунды голосования   | `voting_rounds`            | Раунды голосования в комнате                         | `app/models/voting_round.py`     |
| Голоса               | `votes`                    | Голоса участников в раунде                           | `app/models/vote.py`             |
| Результаты           | `voting_results`           | Агрегированные результаты голосования                | `app/models/voting_result.py`    |

</div>

---

## Миграции

<div align="center">

| **Параметр**       | **Значение / правило**                                         |
| :----------------- | :------------------------------------------------------------- |
| Инструмент         | Alembic (миграции SQLAlchemy)                                  |
| Конфигурация       | `apps/backend/alembic.ini`                                     |
| Папка миграций     | `apps/backend/alembic/versions/`                               |
| Формат имени файла | `<revision_id>_описание.py` (например, `0001_initial_schema.py`) |
| Изменяемость       | Миграции не редактируются после применения в shared-окружениях |

</div>

### Команды Alembic

```bash
# Применить все миграции
alembic upgrade head

# Откатить последнюю миграцию
alembic downgrade -1

# Создать новую миграцию (автогенерация из моделей)
alembic revision --autogenerate -m "описание_изменений"

# Просмотреть историю миграций
alembic history --verbose

# Текущая версия
alembic current
```

---

## Дополнительно

- Источник истины по схеме: SQLAlchemy модели в `apps/backend/app/models/`
- Исполняемая спецификация: SQL-миграции в `apps/backend/alembic/versions/`
- Базовая модель: `apps/backend/app/db/base.py`
- Сессия БД: `apps/backend/app/db/session.py`

---

## Правила изменений схемы

- изменения должны быть обратно совместимыми, если это возможно;
- потенциально долгие операции выполняются отдельно от критичных релизов;
- новые индексы и ограничения сопровождаются обоснованием в PR;
- удаление колонок допускается только после этапа deprecation.
