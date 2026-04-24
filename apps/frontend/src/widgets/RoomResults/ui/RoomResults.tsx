/**
 * Область результатов голосования в игровой комнате.
 *
 * Центральная зона RoomPage. Показывает:
 *  - Название активной задачи
 *  - Среднее значение голосов (Story Points)
 *  - До раскрытия: кнопку «Вскрыть карты» и подсказку о состоянии голосования
 *  - После раскрытия: финальную оценку крупным шрифтом + кнопку «Следующая задача»
 *
 * @param activeTaskTitle — название текущей задачи
 * @param average — среднее значение голосов
 * @param isRevealed — раскрыты ли результаты
 * @param allPlayersVoted — все ли проголосовали
 * @param anyPlayerVoted — есть ли хоть один голос
 * @param onReveal — раскрытие результатов
 * @param onNextTask — переход к следующей задаче
 * @param className — дополнительный CSS-класс
 */
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
  onResetRound?: () => void;
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
  onResetRound,
  className,
}: RoomResultsProps) {
  const hasActiveTask = Boolean(activeTaskTitle);

  return (
    <section
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-2xl backdrop-blur sm:rounded-3xl',
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-table/95 via-table/90 to-table" />
      <div className="absolute inset-2 rounded-2xl border border-table-border/55 sm:inset-2.5 sm:rounded-[1.35rem]" />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-2 sm:p-3">
        <Card className="border border-border/70 bg-card/95 p-2.5 shadow-lg sm:p-3">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-3 sm:items-center">
            <div>
              <div className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.24em]">
                Активная задача
              </div>
              <div className="mt-0.5 line-clamp-2 text-base font-bold text-foreground sm:text-xl">
                {activeTaskTitle ?? 'Добавьте задачу для оценки'}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/45 px-3 py-2 text-right sm:rounded-2xl sm:px-3.5 sm:py-2.5">
              <div className="text-xs text-muted-foreground">Среднее</div>
              <div className="text-lg font-black text-foreground sm:text-xl">{average} SP</div>
            </div>
          </div>
        </Card>

        <div className="flex min-h-0 flex-col gap-2 px-2 py-2 sm:gap-3 sm:px-3 sm:py-3">
          {isRevealed ? (
            <div className="flex w-full flex-col items-center gap-1.5 text-center sm:gap-2">
              <Card className="w-full max-w-66 border border-primary/50 bg-card/95 p-2.5 text-center shadow-xl sm:max-w-70 sm:p-3">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                  Финальная оценка
                </div>
                <div className="mt-1 text-3xl font-black text-primary sm:text-4xl">{average}</div>
                <div className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">
                  Story Points
                </div>
              </Card>

              <div className="flex gap-2">
                {onResetRound && (
                  <Button
                    type="button"
                    onClick={onResetRound}
                    variant="ghost"
                    className="h-8 rounded-2xl px-5 text-sm font-semibold sm:h-9 sm:px-6 sm:text-base"
                  >
                    Переголосовать
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={onNextTask}
                  className="h-8 rounded-2xl px-5 text-sm font-semibold sm:h-9 sm:px-6 sm:text-base"
                >
                  Следующая задача
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-sm font-medium text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
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
                className="h-10 rounded-2xl px-6 text-sm font-semibold shadow-lg sm:px-7 sm:text-base"
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
