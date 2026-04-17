/**
 * Кнопка для выбора карты при голосовании.
 *
 * При клике вызывает useVote(roomId).mutate(vote) для отправки голоса.
 * Отображает метку карты (число, «?», «☕») из VOTE_LABELS.
 * Блокируется во время отправки и если голосование уже раскрыто.
 *
 * @param roomId — ID комнаты
 * @param vote — значение карты (VoteValue)
 * @param disabled — заблокирована ли кнопка
 */
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
    >
      {label}
    </Button>
  );
}
