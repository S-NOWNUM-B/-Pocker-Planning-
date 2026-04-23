/**
 * Список участников игровой комнаты.
 *
 * Отображает горизонтальный скроллящийся список карточек игроков.
 * Для каждого участника показывает:
 *  - Аватар с первой буквой имени
 *  - Имя и роль (если есть)
 *  - Статус голосования: «...» (вопрос выбран и голос ещё не отдан),
 *    «✓» (проголосовал, скрыто), значение карты (если раскрыто)
 *
 * @param players — массив игроков
 * @param hasActiveTask — выбрана ли сейчас задача для оценки
 * @param isRevealed — раскрыты ли результаты
 * @param className — дополнительный CSS-класс
 */
import { Card } from '@/shared/ui';
import { CheckIcon, CoffeeIcon, HelpCircleIcon, TargetIcon } from '@/shared/ui/icons';
import { cn } from '@/shared/lib';
import type { Player } from '@/shared/lib/poker';

interface ParticipantsListProps {
  players: Player[];
  hasActiveTask: boolean;
  isRevealed: boolean;
  className?: string;
}

export function ParticipantsList({ players, hasActiveTask, isRevealed, className }: ParticipantsListProps) {
  if (players.length === 0) {
    return null;
  }

  const renderVisibleVote = (value: string) => {
    if (value === '☕' || value === 'break') {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-sm">
          <CoffeeIcon className="h-3.5 w-3.5" />
        </span>
      );
    }

    if (value === '?') {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-sm">
          <HelpCircleIcon className="h-3.5 w-3.5" />
        </span>
      );
    }

    return value;
  };

  return (
    <section className={cn('w-full', className)}>
      <Card className="h-auto border border-border/70 bg-card/90 p-2.5 shadow-lg backdrop-blur">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">Участники</h2>
          <span className="text-sm text-muted-foreground">{players.length}</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {players.map((player) => {
            const hasVote = player.vote !== null;
            const voteIsVisible = isRevealed && hasVote;
            const isWaitingForTask = !hasActiveTask;

            return (
              <div
                key={player.id}
                className="flex min-w-9.5rem items-center gap-2 rounded-xl border border-border/80 bg-secondary/35 px-2 py-1.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground shadow-sm">
                  {player.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.82rem] font-semibold text-card-foreground">
                    {player.name}
                  </div>
                  {player.role ? (
                    <div className="text-[0.65rem] text-muted-foreground">{player.role}</div>
                  ) : null}
                </div>

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[0.65rem] font-black ${
                    voteIsVisible
                      ? 'border-primary bg-card/90 text-foreground'
                      : hasVote
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isWaitingForTask
                          ? 'border-border bg-card/70 text-muted-foreground'
                          : 'border-border bg-card/70 text-muted-foreground'
                  }`}
                  aria-label={`Голос ${player.name}: ${
                    voteIsVisible
                      ? player.vote
                      : hasVote
                        ? 'проголосовал'
                        : isWaitingForTask
                          ? 'вопрос не выбран'
                          : 'ожидает оценки'
                  }`}
                >
                  {voteIsVisible ? (
                    renderVisibleVote(player.vote as string)
                  ) : hasVote ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : isWaitingForTask ? (
                    <TargetIcon className="h-3.5 w-3.5" />
                  ) : (
                    '...'
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
