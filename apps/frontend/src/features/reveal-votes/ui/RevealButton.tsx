/**
 * Кнопка раскрытия результатов голосования.
 *
 * При клике вызывает useRevealVotes(roomId).mutate() для показа голосов.
 * Доступна только модератору. Блокируется во время отправки.
 *
 * @param roomId — ID комнаты
 * @param disabled — заблокирована ли кнопка (например, если не все проголосовали)
 */
import { Button } from '@/shared/ui';
import { useRevealVotes } from '../lib/useRevealVotes';

interface RevealButtonProps {
  roomId: string;
  disabled?: boolean;
}

export function RevealButton({ roomId, disabled }: RevealButtonProps) {
  const { mutate, isPending } = useRevealVotes(roomId);

  return (
    <Button onClick={() => mutate()} disabled={disabled || isPending} variant="primary">
      {isPending ? 'Revealing...' : 'Reveal Votes'}
    </Button>
  );
}
