# Проблемы единообразия стиля проекта

> Дата анализа: 2026-04-24

Документ содержит список несоответствий в стиле кода, которые необходимо исправить для поддержания единого стандарта в проекте.

---

## 🚨 Критичные проблемы архитектуры

### Проблема 1: Использование нативных HTML элементов вместо UI-компонентов
Проект имеет готовые UI-компоненты на базе Headless UI, но в некоторых местах используются нативные HTML элементы с дублированием стилей.

**Существующие компоненты:**
- `Button` (на базе Headless UI Button)
- `Modal` (на базе Headless UI Dialog)
- `Badge` (готовый компонент для меток)
- `Switch` (на базе Headless UI Switch)
- `RadioGroup` (на базе Headless UI RadioGroup)

---

### Проблема 2: Нативные `<button>` вместо компонента `Button`

**Файл:** `src/widgets/TaskSidebar/ui/TaskSidebar.tsx`

**Строки 113-148:** Три кнопки фильтров используют нативный `<button>` с дублированием стилей
```tsx
<button
  type="button"
  onClick={() => setFilter('all')}
  className={cn(
    'flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
    filter === 'all'
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary',
  )}
>
  Все ({tasks.length})
</button>
```

**Что нужно:**
Использовать компонент `Button` с вариантом или создать отдельный компонент `SegmentedControl` на базе Headless UI RadioGroup:

```tsx
import { RadioGroup } from '@/shared/ui';

<RadioGroup
  value={filter}
  onChange={setFilter}
  options={[
    { value: 'all', label: `Все (${tasks.length})` },
    { value: 'pending', label: `Не оценённые (${pendingCount})` },
    { value: 'estimated', label: `Оценённые (${estimatedCount})` },
  ]}
/>
```

---

**Строки 230-253, 256-282:** Кнопки редактирования и удаления используют нативный `<button>`
```tsx
<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    handleStartEdit(task);
  }}
  className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
  title="Редактировать задачу"
>
  <svg>...</svg>
</button>
```

**Что нужно:**
Использовать компонент `Button` с вариантом `ghost` и размером `icon`:

```tsx
import { Button } from '@/shared/ui';
import { EditIcon, TrashIcon } from '@/shared/ui/icons';

<Button
  variant="ghost"
  size="icon"
  onClick={(e) => {
    e.stopPropagation();
    handleStartEdit(task);
  }}
  title="Редактировать задачу"
>
  <EditIcon className="h-4 w-4" />
</Button>
```

---

### Проблема 3: `window.confirm` вместо Modal

**Файл:** `src/widgets/TaskSidebar/ui/TaskSidebar.tsx`

**Строка 260:** Используется нативный `window.confirm` для подтверждения удаления
```tsx
if (window.confirm(`Удалить задачу "${task.title}"?`)) {
  onDeleteTask(task.id);
}
```

**Что нужно:**
Создать компонент `ConfirmDialog` на базе существующего `Modal` или использовать Headless UI Dialog:

```tsx
// src/shared/ui/ConfirmDialog/ConfirmDialog.tsx
import { Modal, Button } from '@/shared/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

**Использование:**
```tsx
const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

<ConfirmDialog
  isOpen={deleteConfirm !== null}
  onClose={() => setDeleteConfirm(null)}
  onConfirm={() => {
    if (deleteConfirm) onDeleteTask(deleteConfirm);
    setDeleteConfirm(null);
  }}
  title="Удалить задачу?"
  message={`Вы уверены, что хотите удалить задачу "${task.title}"?`}
  confirmText="Удалить"
  cancelText="Отмена"
/>
```

---

### Проблема 4: Кастомные `<span>` вместо компонента `Badge`

**Файл:** `src/widgets/TaskSidebar/ui/TaskSidebar.tsx`

**Строка 220:** Бейдж с оценкой задачи использует кастомный span
```tsx
<span className="shrink-0 rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
  {task.estimate} SP
</span>
```

**Файл:** `src/widgets/RoomHistory/ui/RoomHistory.tsx`

**Строка 55:** Бейдж с оценкой в истории
```tsx
<span className="inline-block rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
  {item.result_value} SP
</span>
```

**Что нужно:**
Существующий компонент `Badge` использует `rounded-full`, но для оценок нужен `rounded-lg`. Варианты решения:

**Вариант 1:** Расширить компонент `Badge` с поддержкой разных форм:
```tsx
// src/shared/ui/Badge/Badge.tsx
export interface BadgeProps {
  label: string;
  color?: BadgeColor;
  shape?: 'pill' | 'rounded'; // pill = rounded-full, rounded = rounded-lg
}

export function Badge({ label, color = 'gray', shape = 'pill' }: BadgeProps) {
  const shapeClass = shape === 'pill' ? 'rounded-full' : 'rounded-lg';
  return (
    <span className={`inline-block ${shapeClass} px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${colorClasses[color]}`}>
      {label}
    </span>
  );
}
```

**Вариант 2:** Создать отдельный компонент `ScoreBadge`:
```tsx
// src/shared/ui/ScoreBadge/ScoreBadge.tsx
interface ScoreBadgeProps {
  value: string;
  unit?: string;
}

export function ScoreBadge({ value, unit = 'SP' }: ScoreBadgeProps) {
  return (
    <span className="shrink-0 rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
      {value} {unit}
    </span>
  );
}
```

**Использование:**
```tsx
import { ScoreBadge } from '@/shared/ui';

<ScoreBadge value={task.estimate} />
```

---

## 🎨 Использование иконок

### Проблема
В проекте существует централизованная система иконок (`src/shared/ui/icons.tsx`), но в некоторых компонентах используются inline SVG вместо готовых компонентов.

### Где исправить

#### 1. TaskSidebar — иконки редактирования и удаления
**Файл:** `src/widgets/TaskSidebar/ui/TaskSidebar.tsx`

**Строки 239-252:** Inline SVG для иконки редактирования (карандаш)
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  <path d="m15 5 4 4" />
</svg>
```

**Строки 267-281:** Inline SVG для иконки удаления (корзина)
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M3 6h18" />
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
</svg>
```

**Что нужно:**
1. Добавить `EditIcon` и `TrashIcon` в `src/shared/ui/icons.tsx`
2. Заменить inline SVG на импорт компонентов:
```tsx
import { EditIcon, TrashIcon } from '@/shared/ui/icons';

// Использование:
<EditIcon className="h-4 w-4" />
<TrashIcon className="h-4 w-4" />
```

---

#### 2. RoomHeader — иконка истории
**Файл:** `src/widgets/RoomHeader/ui/RoomHeader.tsx`

**Строки 103-118:** Inline SVG для иконки истории (часы с стрелкой)
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="h-4 w-4"
>
  <path d="M3 3v5h5" />
  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
  <path d="M12 7v5l4 2" />
</svg>
```

**Что нужно:**
1. Добавить `HistoryIcon` (или `ClockIcon`) в `src/shared/ui/icons.tsx`
2. Заменить inline SVG:
```tsx
import { HistoryIcon } from '@/shared/ui/icons';

<HistoryIcon className="h-4 w-4" />
```

---

#### 3. Button — спиннер загрузки
**Файл:** `src/shared/ui/Button/Button.tsx`

**Строки 59-75:** Inline SVG для спиннера
```tsx
<svg
  className="h-4 w-4 animate-spin"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
```

**Что нужно:**
1. Создать отдельный компонент `Spinner` в `src/shared/ui/Spinner/Spinner.tsx`
2. Переиспользовать его в Button и других местах (RoomPage также использует идентичный спиннер)

---

#### 4. RoomPage — спиннер переподключения
**Файл:** `src/pages/RoomPage/ui/RoomPage.tsx`

**Строки 471-487:** Дублирование спиннера из Button
```tsx
<svg
  className="h-4 w-4 animate-spin"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
```

**Что нужно:**
Использовать общий компонент `Spinner`:
```tsx
import { Spinner } from '@/shared/ui';

<Spinner className="h-4 w-4" />
```

---

## 🔄 Округление углов (Border Radius)

### Проблема
В проекте используются разные значения `rounded-*` без единого стандарта:
- `rounded-lg` (8px)
- `rounded-xl` (12px)
- `rounded-2xl` (16px)
- `rounded-full` (50%)

### Рекомендации по использованию

**Мелкие элементы (badges, chips, small buttons):**
- `rounded-lg` — бейджи с оценками (SP), фильтры, маленькие кнопки

**Средние элементы (buttons, inputs, cards):**
- `rounded-xl` — основные кнопки, поля ввода, иконки-контейнеры

**Крупные элементы (panels, modals, sidebars):**
- `rounded-2xl` — карточки задач, панели, модальные окна

**Круглые элементы:**
- `rounded-full` — аватары, индикаторы онлайн-статуса, круглые бейджи

### Где проверить консистентность

**Файлы для ревью:**
- `src/widgets/TaskSidebar/ui/TaskSidebar.tsx` — карточки задач используют `rounded-2xl` ✅
- `src/widgets/RoomResults/ui/RoomResults.tsx` — кнопки используют `rounded-2xl` ✅
- `src/widgets/RoomHeader/ui/RoomHeader.tsx` — иконки используют `rounded-xl` ✅
- `src/widgets/ParticipantsList/ui/ParticipantsList.tsx` — аватары используют `rounded-full` ✅

**Вывод:** Округление углов в целом консистентно, серьёзных проблем не выявлено.

---

## 📏 Размеры кнопок

### Проблема
Кнопки имеют разные высоты в разных компонентах:
- `h-8` (32px) — мелкие кнопки
- `h-9` (36px) — средние кнопки
- `h-10` (40px) — основные кнопки
- `h-11` (44px) — крупные кнопки

### Где используется

**h-8:** `RoomResults` — кнопки "Переголосовать", "Следующая задача" (мобильная версия)
**h-9:** `RoomResults` — кнопки на десктопе
**h-10:** `RoomHeader` — кнопки "История", "Пригласить", "Выйти"
**h-11:** `TaskSidebar` — поле ввода новой задачи

### Рекомендация
Стандартизировать высоты:
- **Мелкие кнопки (secondary actions):** `h-8`
- **Основные кнопки (primary actions):** `h-10`
- **Поля ввода:** `h-11`

**Что исправить:**
- `RoomResults` — унифицировать высоту кнопок до `h-9` или `h-10` (сейчас `h-8` на мобильных, `h-9` на десктопе)

---

## 🎨 Цветовые схемы

### Проблема
Некоторые компоненты используют хардкод цветов вместо theme-переменных.

### Где проверить

**Файл:** `src/widgets/ParticipantsList/ui/ParticipantsList.tsx`

**Строка 225:** Хардкод зелёного цвета для онлайн-индикатора
```tsx
<div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" title="Онлайн"/>
```

**Рекомендация:**
Использовать theme-переменную или создать CSS-класс:
```tsx
// Вариант 1: использовать существующую переменную
bg-primary // если зелёный — акцентный цвет

// Вариант 2: добавить в tailwind.config.js
colors: {
  online: 'hsl(var(--online))', // определить в globals.css
}

// Использование:
bg-online
```

## 🔢 Магические числа

### Проблема
В коде встречаются магические числа без объяснения.

### Примеры

**Файл:** `src/widgets/TaskSidebar/ui/TaskSidebar.tsx`

**Строка 177:** `maxLength={240}` — лимит символов для редактирования задачи
**Строка 297:** `maxLength={240}` — лимит символов для новой задачи

**Рекомендация:**
Вынести в константы:
```typescript
// src/shared/lib/constants/validation.ts
export const VALIDATION = {
  TASK_TITLE_MAX_LENGTH: 240,
  TASK_TITLE_WARNING_LENGTH: 200,
  TASK_TITLE_DANGER_LENGTH: 220,
} as const;
```

**Использование:**
```tsx
import { VALIDATION } from '@/shared/lib/constants/validation';

<Input maxLength={VALIDATION.TASK_TITLE_MAX_LENGTH} />

{newTaskTitle.length > VALIDATION.TASK_TITLE_DANGER_LENGTH
  ? 'text-destructive'
  : newTaskTitle.length > VALIDATION.TASK_TITLE_WARNING_LENGTH
    ? 'text-amber-500'
    : 'text-muted-foreground'
}
```

---

## 📦 Структура импортов

### Проблема
Импорты не всегда следуют единому порядку.

### Рекомендуемый порядок

1. React и хуки
2. Сторонние библиотеки (react-router, tanstack-query)
3. Внутренние модули (@/app, @/entities, @/features)
4. UI-компоненты (@/shared/ui)
5. Утилиты и типы (@/shared/lib)
6. Локальные импорты (./lib, ../lib)

### Пример правильного порядка

```typescript
// 1. React
import { useEffect, useState } from 'react';

// 2. Сторонние библиотеки
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';

// 3. Внутренние модули
import { useSession } from '@/app/providers';
import { roomApi } from '@/entities/room';
import { handleRevealAction } from '@/features/voting/lib/roomVotingActions';

// 4. UI-компоненты
import { Card, Spinner } from '@/shared/ui';

// 5. Утилиты и типы
import { getLocalSession } from '@/shared/lib/room';
import type { RoomSnapshot } from '@/shared/lib/types';

// 6. Локальные импорты
import { useRoomParams } from '../lib/useRoomParams';
```

---

## ✅ Чек-лист исправлений

### 🔴 Критичный приоритет (архитектурные проблемы)
- [ ] Создать компонент `ConfirmDialog` в `src/shared/ui/ConfirmDialog/ConfirmDialog.tsx`
- [ ] Заменить `window.confirm` на `ConfirmDialog` в `TaskSidebar.tsx`
- [ ] Заменить нативные `<button>` на компонент `Button` в `TaskSidebar.tsx`:
  - [ ] Кнопки фильтров (строки 113-148) — использовать `RadioGroup` или создать `SegmentedControl`
  - [ ] Кнопки редактирования и удаления (строки 230-282) — использовать `Button` с `variant="ghost"` и `size="icon"`
- [ ] Расширить компонент `Badge` с поддержкой `shape` или создать `ScoreBadge`
- [ ] Заменить кастомные `<span>` на `Badge`/`ScoreBadge` в:
  - [ ] `TaskSidebar.tsx` (строка 220)
  - [ ] `RoomHistory.tsx` (строка 55)

### 🟠 Высокий приоритет (иконки и спиннеры)
- [ ] Создать `EditIcon` и `TrashIcon` в `src/shared/ui/icons.tsx`
- [ ] Создать `HistoryIcon` в `src/shared/ui/icons.tsx`
- [ ] Создать компонент `Spinner` в `src/shared/ui/Spinner/Spinner.tsx`
- [ ] Заменить все inline SVG на компоненты иконок в:
  - [ ] `TaskSidebar.tsx` (EditIcon, TrashIcon)
  - [ ] `RoomHeader.tsx` (HistoryIcon)
  - [ ] `Button.tsx` (Spinner)
  - [ ] `RoomPage.tsx` (Spinner)

### 🟡 Средний приоритет (константы и стандартизация)
- [ ] Создать константы валидации в `src/shared/lib/constants/validation.ts`
- [ ] Заменить магические числа на константы в `TaskSidebar.tsx`
- [ ] Унифицировать высоту кнопок в `RoomResults.tsx`

### 🟢 Низкий приоритет (полировка)
- [ ] Заменить `bg-green-500` на theme-переменную в `ParticipantsList.tsx`
- [ ] Упорядочить импорты во всех файлах согласно рекомендациям
- [ ] Добавить комментарии к сложным CSS-классам

---

## 📊 Статистика

**Всего файлов с inline SVG:** 4
- `TaskSidebar.tsx` — 2 иконки
- `RoomHeader.tsx` — 1 иконка
- `Button.tsx` — 1 спиннер
- `RoomPage.tsx` — 1 спиннер

**Использование нативных HTML элементов вместо UI-компонентов:**
- Нативные `<button>` вместо `Button`: 5 мест в `TaskSidebar.tsx`
- Кастомные `<span>` вместо `Badge`: 2 места
- `window.confirm` вместо `Modal`: 1 место

**Магические числа:** 6 вхождений (240, 200, 220)

**Компоненты, требующие создания:**
- `ConfirmDialog` — модальное окно подтверждения
- `ScoreBadge` или расширение `Badge` — бейджи с оценками
- `SegmentedControl` (опционально) — группа кнопок-фильтров
- `Spinner` — компонент загрузки
- Иконки: `EditIcon`, `TrashIcon`, `HistoryIcon`

---

## 🎯 Итоговые рекомендации

1. **Приоритет 1 (Критичный):** Заменить нативные HTML элементы на UI-компоненты из `shared/ui`
   - Это нарушает архитектуру проекта и создаёт дублирование кода
   - Headless UI уже подключен, но не используется везде
   - Создать недостающие компоненты: `ConfirmDialog`, `ScoreBadge`/расширить `Badge`

2. **Приоритет 2 (Высокий):** Централизовать все иконки в `icons.tsx` и создать переиспользуемый `Spinner`
   - Убрать inline SVG из компонентов
   - Создать недостающие иконки: `EditIcon`, `TrashIcon`, `HistoryIcon`

3. **Приоритет 3 (Средний):** Вынести константы лимитов валидации
   - Упростит поддержку и локализацию в будущем

4. **Приоритет 4 (Низкий):** Стандартизировать размеры кнопок, цветовые схемы, порядок импортов
   - Улучшит читаемость и консистентность

**Главная проблема:** В проекте есть готовая UI-система на базе Headless UI, но она не используется последовательно. Новый код добавляет нативные HTML элементы с дублированием стилей вместо использования существующих компонентов.

После выполнения этих исправлений проект будет иметь единый, консистентный стиль кода с правильной архитектурой компонентов.
