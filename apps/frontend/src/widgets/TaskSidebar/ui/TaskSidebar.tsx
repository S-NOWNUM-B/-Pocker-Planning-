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
 * @param className — дополнительный CSS-класс
 */
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
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
  className,
}: TaskSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-full shrink-0 flex-col rounded-3xl border border-border/70 bg-card/95 p-4 shadow-lg lg:w-80',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">Задачи</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {tasks.filter((task) => task.estimate).length}/{tasks.length}
        </span>
      </div>

      <div className="mb-3 max-h-58 space-y-2 overflow-y-auto pr-1 lg:min-h-0 lg:flex-1 lg:max-h-none">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
            Добавьте первую задачу, чтобы начать оценку
          </div>
        ) : (
          tasks.map((task) => {
            const isActive = task.id === activeTaskId;

            return (
              <div key={task.id} className="group relative">
                <Button
                  type="button"
                  onClick={() => !isRevealed && onSelectTask(task.id)}
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
                        <span className="shrink-0 rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          {task.estimate} SP
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
                {onDeleteTask && !task.estimate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Удалить задачу "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    title="Удалить задачу"
                  >
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
                  </button>
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
          style={{ paddingRight: '2.75rem' }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onAddTask();
            }
          }}
        />
      </div>
    </aside>
  );
}
