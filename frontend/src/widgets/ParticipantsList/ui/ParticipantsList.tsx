import { Card } from '@/shared/ui';
import { CoffeeIcon, HelpCircleIcon } from '@/shared/ui/icons';
import { cn } from '@/shared/lib';
import type { Player } from '@/shared/lib/poker';

interface ParticipantsListProps {
  players: Player[];
  isRevealed: boolean;
  className?: string;
}

export function ParticipantsList({ players, isRevealed, className }: ParticipantsListProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className={cn('w-full', className)}>
      <Card className="h-full border border-border/70 bg-card/90 p-2.5 shadow-lg backdrop-blur">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">Участники</h2>
          <span className="text-sm text-muted-foreground">{players.length}</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {players.map((player) => {
            const voteIsVisible = isRevealed && player.vote !== null;
            const voteLabel = voteIsVisible ? player.vote : player.vote ? '✓' : '...';

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
                    player.vote && !isRevealed
                      ? 'border-primary bg-primary text-primary-foreground'
                      : player.vote && isRevealed
                        ? 'border-primary bg-card/90 text-foreground'
                        : 'border-border bg-card/70 text-muted-foreground'
                  }`}
                  aria-label={`Голос ${player.name}: ${voteLabel ?? 'не выбран'}`}
                >
                  {voteIsVisible ? (
                    player.vote === '☕' ? (
                      <CoffeeIcon className="h-3.5 w-3.5" />
                    ) : player.vote === '?' ? (
                      <HelpCircleIcon className="h-3.5 w-3.5" />
                    ) : (
                      player.vote
                    )
                  ) : player.vote ? (
                    '✓'
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
