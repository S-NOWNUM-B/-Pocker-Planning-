import { Input } from '@/shared/ui';
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
              <button
                key={task.id}
                type="button"
                onClick={() => !isRevealed && onSelectTask(task.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  isActive
                    ? 'border-primary/70 bg-primary/12 shadow-sm'
                    : task.estimate
                      ? 'border-border bg-secondary/45 text-muted-foreground'
                      : 'border-border/80 bg-card/80 hover:border-primary/50 hover:bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-medium">{task.title}</span>
                  {task.estimate && (
                    <span className="shrink-0 rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {task.estimate} SP
                    </span>
                  )}
                </div>
              </button>
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
