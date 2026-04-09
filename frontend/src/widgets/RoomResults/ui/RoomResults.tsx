import { Button, Card } from '@/shared/ui';

interface RoomResultsProps {
  activeTaskTitle: string | null;
  average: string;
  isRevealed: boolean;
  allPlayersVoted: boolean;
  anyPlayerVoted: boolean;
  statusMessage: string;
  onReveal: () => void;
  onNextTask: () => void;
}

export function RoomResults({
  activeTaskTitle,
  average,
  isRevealed,
  allPlayersVoted,
  anyPlayerVoted,
  statusMessage,
  onReveal,
  onNextTask,
}: RoomResultsProps) {
  return (
    <section className="relative flex min-h-28rem flex-1 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-2xl backdrop-blur lg:min-h-32rem">
      <div className="absolute inset-4 rounded-4xl bg-table/95 shadow-inner" />
      <div className="absolute inset-4 rounded-4xl border-4 border-table-border/50" />

      <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-6">
        <Card className="mb-5 border border-border/70 bg-card/95 p-4 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Текущая задача
              </div>
              <div className="mt-1 text-lg font-bold text-foreground">
                {activeTaskTitle ?? 'Добавьте задачу для оценки'}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-right">
              <div className="text-xs text-muted-foreground">Средняя оценка</div>
              <div className="font-semibold text-foreground">{average} SP</div>
            </div>
          </div>
        </Card>

        {statusMessage && (
          <div className="mb-4 rounded-2xl border border-border bg-card/90 px-4 py-3 text-sm text-muted-foreground shadow-sm">
            {statusMessage}
          </div>
        )}

        <div className="flex flex-1 items-center justify-center py-4">
          {isRevealed ? (
            <Card className="mb-4 border border-primary/50 bg-card/95 p-6 text-center shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Результат
              </div>
              <div className="mt-2 text-6xl font-black text-primary">{average}</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">Story Points</div>
            </Card>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {anyPlayerVoted && (
                <div className="text-sm text-foreground">
                  {allPlayersVoted ? 'Все проголосовали. Можно вскрывать карты.' : 'Кто-то уже проголосовал.'}
                </div>
              )}
              <Button
                type="button"
                onClick={onReveal}
                disabled={!allPlayersVoted && !anyPlayerVoted}
                className="h-12 rounded-2xl px-8 text-base font-semibold"
              >
                Вскрыть карты
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 pb-2">
          {isRevealed ? (
            <Button type="button" onClick={onNextTask} className="h-12 rounded-2xl px-8 text-base font-semibold">
              Следующая задача
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}