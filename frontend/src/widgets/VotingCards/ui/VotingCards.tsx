import { Button } from '@/shared/ui';
import { CoffeeIcon, HelpCircleIcon } from '@/shared/ui/icons';

interface VotingCardsProps {
  cards: string[];
  selectedCard: string | null;
  disabled?: boolean;
  onSelectCard: (card: string) => void;
}

export function VotingCards({
  cards,
  selectedCard,
  disabled = false,
  onSelectCard,
}: VotingCardsProps) {
  return (
    <section className="z-20 border-t border-border/70 bg-card/92 shadow-[0_-8px_30px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-1.5 sm:px-6 lg:px-8">
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Карты голосования
          </div>
          <div className="text-[0.72rem] text-muted-foreground">
            {selectedCard ? `Выбрано: ${selectedCard}` : 'Карта не выбрана'}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(2.75rem,1fr))] gap-2 justify-items-center sm:gap-3">
          {cards.map((card) => (
            <Button
              key={card}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCard(card)}
              variant={selectedCard === card ? 'primary' : 'outline'}
              className="flex h-12 w-10 rounded-lg text-sm font-black shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-11 sm:text-base"
            >
              {card === '☕' ? (
                <CoffeeIcon className="h-4 w-4" />
              ) : card === '?' ? (
                <HelpCircleIcon className="h-4 w-4" />
              ) : (
                card
              )}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
