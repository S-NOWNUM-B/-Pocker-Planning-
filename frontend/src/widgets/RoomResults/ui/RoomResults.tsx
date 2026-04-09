import { Button, Card } from '@/shared/ui';
import { cn } from '@/shared/lib';

interface RoomResultsProps {
  activeTaskTitle: string | null;
  average: string;
  isRevealed: boolean;
  allPlayersVoted: boolean;
  anyPlayerVoted: boolean;
  onReveal: () => void;
  onNextTask: () => void;
  className?: string;
}

export function RoomResults({
  activeTaskTitle,
  average,
  isRevealed,
  allPlayersVoted,
  anyPlayerVoted,
  onReveal,
  onNextTask,
  className,
}: RoomResultsProps) {
  const hasActiveTask = Boolean(activeTaskTitle);

  return (
    <section
      className={cn(
        'relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-2xl backdrop-blur',
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-table/95 via-table/90 to-table" />
      <div className="absolute inset-2.5 rounded-[1.35rem] border border-table-border/55" />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-2.5 sm:p-3">
        <Card className="border border-border/70 bg-card/95 p-3 shadow-lg">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Активная задача
              </div>
              <div className="mt-0.5 line-clamp-2 text-lg font-bold text-foreground sm:text-xl">
                {activeTaskTitle ?? 'Добавьте задачу для оценки'}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/45 px-3.5 py-2.5 text-right">
              <div className="text-xs text-muted-foreground">Среднее</div>
              <div className="text-xl font-black text-foreground">{average} SP</div>
            </div>
          </div>
        </Card>

        <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-1.5">
          {isRevealed ? (
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <Card className="w-full max-w-[20rem] border border-primary/50 bg-card/95 p-3.5 text-center shadow-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Финальная оценка
                </div>
                <div className="mt-1.5 text-4xl font-black text-primary sm:text-5xl">{average}</div>
                <div className="mt-0.5 text-sm font-medium text-muted-foreground">Story Points</div>
              </Card>

              <Button
                type="button"
                onClick={onNextTask}
                className="h-9 rounded-2xl px-6 text-base font-semibold"
              >
                Следующая задача
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-sm font-medium text-primary-foreground/92 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                {allPlayersVoted
                  ? 'Все участники проголосовали. Можно показывать результат.'
                  : anyPlayerVoted
                    ? 'Часть голосов уже есть. Можно вскрыть сейчас или подождать остальных.'
                    : hasActiveTask
                      ? 'Пока нет голосов. Выберите карту, чтобы начать раунд.'
                      : 'Пока нет активной задачи. Добавьте задачу и начните раунд.'}
              </div>
              <Button
                type="button"
                onClick={onReveal}
                disabled={!hasActiveTask || (!allPlayersVoted && !anyPlayerVoted)}
                className="h-10 rounded-2xl px-7 text-base font-semibold shadow-lg"
              >
                Вскрыть карты
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
