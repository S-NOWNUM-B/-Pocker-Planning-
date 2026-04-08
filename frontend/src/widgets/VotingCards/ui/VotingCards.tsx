import { VoteButton } from '@/features/vote';
import { Card } from '@/shared/ui';
import type { VoteValue } from '@poker/shared';

const VOTE_VALUES: VoteValue[] = ['0', '1/2', '1', '2', '3', '5', '8', '13', '21', '?', 'coffee'];

interface VotingCardsProps {
  roomId: string;
  disabled?: boolean;
}

export function VotingCards({ roomId, disabled = false }: VotingCardsProps) {
  return (
    <section className="p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h2>
      <Card className="p-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 justify-items-center">
          {VOTE_VALUES.map((vote) => (
            <VoteButton key={vote} roomId={roomId} vote={vote} disabled={disabled} />
          ))}
        </div>
      </Card>
    </section>
  );
}
