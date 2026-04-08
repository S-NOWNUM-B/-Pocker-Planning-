import { Button } from '@/shared/ui';
import { useVote } from '../lib/useVote';
import type { VoteValue } from '@poker/shared';
import { VOTE_LABELS } from '@/entities/vote';

interface VoteButtonProps {
  roomId: string;
  vote: VoteValue;
  disabled?: boolean;
}

export function VoteButton({ roomId, vote, disabled }: VoteButtonProps) {
  const { mutate, isPending } = useVote(roomId);
  const label = VOTE_LABELS[vote];

  return (
    <Button
      onClick={() => mutate(vote)}
      disabled={disabled || isPending}
      variant="card"
      className="transition-all hover:-translate-y-1"
    >
      {label}
    </Button>
  );
}
