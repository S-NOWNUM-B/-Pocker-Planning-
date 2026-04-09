import { Card } from '@/shared/ui';
import { CoffeeIcon, HelpCircleIcon } from '@/shared/ui/icons';
import type { Player } from '@/shared/lib/poker';

interface ParticipantsListProps {
  players: Player[];
  isRevealed: boolean;
}

export function ParticipantsList({ players, isRevealed }: ParticipantsListProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
      <Card className="border border-border/70 bg-card/80 px-6 py-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-foreground">Участники</h2>
          <span className="text-sm text-muted-foreground">{players.length}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {players.map((player) => {
            const voteIsVisible = isRevealed && player.vote !== null;

            return (
              <div key={player.id} className="flex flex-col items-center gap-3">
                <div
                  className={`flex h-24 w-16 items-center justify-center rounded-2xl border-2 text-2xl font-black shadow-lg transition ${
                    player.vote && !isRevealed
                      ? 'border-primary bg-primary text-primary-foreground'
                      : player.vote && isRevealed
                        ? 'border-primary bg-card text-foreground'
                        : 'border-border bg-card/80 text-muted-foreground'
                  }`}
                >
                  {voteIsVisible ? (
                    player.vote === '☕' ? (
                      <CoffeeIcon className="h-6 w-6" />
                    ) : player.vote === '?' ? (
                      <HelpCircleIcon className="h-6 w-6" />
                    ) : (
                      player.vote
                    )
                  ) : player.vote ? (
                    '✓'
                  ) : (
                    '?'
                  )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                  {player.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="rounded-full bg-card/80 px-3 py-1 text-sm font-semibold text-card-foreground shadow-sm">
                  {player.name}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
