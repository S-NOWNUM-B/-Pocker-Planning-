import { VotingCards } from '@/widgets/VotingCards';

interface RoomFooterProps {
  cards: string[];
  selectedCard: string | null;
  disabled?: boolean;
  onSelectCard: (card: string) => void;
}

export function RoomFooter({
  cards,
  selectedCard,
  disabled = false,
  onSelectCard,
}: RoomFooterProps) {
  return (
    <footer>
      <VotingCards
        cards={cards}
        selectedCard={selectedCard}
        disabled={disabled}
        onSelectCard={onSelectCard}
      />
    </footer>
  );
}
