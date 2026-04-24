/**
 * Боковая панель задач в игровой комнате.
 *
 * Левая колонка RoomPage (на десктопе). Содержит:
 *  - Список задач с отметкой оценённых (SP)
 *  - Счётчик оценённых/всего задач
 *  - Поле ввода для добавления новой задачи
 *
 * При клике на задачу — она становится активной для голосования.
 * Оценённые задачи визуально отличаются (приглушённый цвет + бейдж SP).
 *
 * @param tasks — массив задач
 * @param activeTaskId — ID текущей активной задачи
 * @param isRevealed — раскрыты ли результаты (блокирует переключение)
 * @param newTaskTitle — значение поля ввода новой задачи
 * @param onNewTaskTitleChange — обработчик изменения поля
 * @param onAddTask — добавление задачи (Enter или кнопка)
 * @param onSelectTask — выбор активной задачи
 * @param onDeleteTask — удаление задачи
 * @param onUpdateTask — редактирование задачи
 * @param className — дополнительный CSS-класс
 */
import { useState } from 'react';
import { Input, ConfirmDialog, Badge } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { EditIcon, TrashIcon } from '@/shared/ui/icons';
import { cn } from '@/shared/lib';
import type { Task } from '@/shared/lib/poker';

interface TaskSidebarProps {
  tasks: Task[];
  activeTaskId: string | null;
  isRevealed: boolean;
  newTaskTitle: string;
  onNewTaskTitleChange: (value: string) => void;
  onAddTask: () => void;
  onSelectTask: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, newTitle: string) => void;
  className?: string;
}

export function TaskSidebar({
  tasks,
  activeTaskId,
  isRevealed,
  newTaskTitle,
  onNewTaskTitleChange,
  onAddTask,
  onSelectTask,
  onDeleteTask,
  onUpdateTask,
  className,
}: TaskSidebarProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'estimated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const handleStartEdit = (task: Task) => {
    if (task.estimate) return; // Нельзя редактировать оценённые задачи
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (editingTaskId && editingTitle.trim() && onUpdateTask) {
      onUpdateTask(editingTaskId, editingTitle.trim());
      setEditingTaskId(null);
      setEditingTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const filteredTasks = tasks.filter((task) => {
    // Фильтр по статусу
    if (filter === 'pending' && task.estimate) return false;
    if (filter === 'estimated' && !task.estimate) return false;

    // Поиск по названию
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });
  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-full shrink-0 flex-col rounded-3xl border border-border/70 bg-card/95 p-4 shadow-lg lg:w-80',
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">Задачи</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {filteredTasks.filter((task) => task.estimate).length}/{filteredTasks.length}
        </span>
      </div>

      <div className="mb-3 space-y-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск задач..."
          className="h-9 text-sm"
        />

        <div className="flex gap-1">
          <Button
            type="button"
            variant={filter === 'all' ? 'primary' : 'subtle'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1 text-xs"
          >
            Все
          </Button>
          <Button
            type="button"
            variant={filter === 'pending' ? 'primary' : 'subtle'}
            size="sm"
            onClick={() => setFilter('pending')}
            className="flex-1 text-xs"
          >
            Не оценённые
          </Button>
          <Button
            type="button"
            variant={filter === 'estimated' ? 'primary' : 'subtle'}
            size="sm"
            onClick={() => setFilter('estimated')}
            className="flex-1 text-xs"
          >
            Оценённые
          </Button>
        </div>
      </div>

      <div className="mb-3 max-h-58 space-y-2 overflow-y-auto pr-1 lg:min-h-0 lg:flex-1 lg:max-h-none">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
            {searchQuery ? 'Задачи не найдены' : 'Добавьте первую задачу, чтобы начать оценку'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = task.id === activeTaskId;
            const isEditing = editingTaskId === task.id;

            if (isEditing) {
              return (
                <div key={task.id} className="rounded-2xl border border-primary/70 bg-card/95 p-3">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit();
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                    autoFocus
                    className="mb-2"
                    maxLength={240}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editingTitle.trim()}
                      className="h-8 flex-1 text-xs"
                    >
                      Сохранить
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="ghost"
                      className="h-8 flex-1 text-xs"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div key={task.id} className="group relative">
                <Button
                  type="button"
                  onClick={() => !isRevealed && onSelectTask(task.id)}
                  onDoubleClick={() => !task.estimate && onUpdateTask && handleStartEdit(task)}
                  variant="ghost"
                  className={`w-full border p-3 text-left ${
                    isActive
                      ? 'border-primary/70 bg-primary/12 shadow-sm'
                      : task.estimate
                        ? 'border-border bg-secondary/45 text-muted-foreground'
                        : 'border-border/80 bg-card/80 hover:border-primary/50 hover:bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2 text-sm font-medium">{task.title}</span>
                    <div className="flex items-center gap-1.5">
                      {task.estimate && (
                        <Badge label={`${task.estimate} SP`} color="primary" shape="rounded" />
                      )}
                    </div>
                  </div>
                </Button>
                {!task.estimate && (
                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {onUpdateTask && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(task);
                        }}
                        className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        title="Редактировать задачу"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteTask && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ id: task.id, title: task.title });
                        }}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Удалить задачу"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="relative pt-1">
        <Input
          value={newTaskTitle}
          onChange={(event) => onNewTaskTitleChange(event.target.value)}
          placeholder="Новая задача"
          className="h-11 w-full"
          style={{ paddingRight: '4.75rem' }}
          maxLength={240}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onAddTask();
            }
          }}
        />
        <span
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
            newTaskTitle.length > 220
              ? 'text-destructive'
              : newTaskTitle.length > 200
                ? 'text-amber-500'
                : 'text-muted-foreground'
          }`}
        >
          {newTaskTitle.length}/240
        </span>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm && onDeleteTask) {
            onDeleteTask(deleteConfirm.id);
          }
        }}
        title="Удалить задачу?"
        message={`Вы уверены, что хотите удалить задачу "${deleteConfirm?.title}"?`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </aside>
  );
}
