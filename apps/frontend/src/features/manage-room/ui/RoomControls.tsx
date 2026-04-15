/**
 * Кнопка сброса комнаты (перезапуск раунда).
 *
 * При клике вызывает useResetRoom(roomId).mutate() для сброса голосов.
 * Доступна только модератору. Поддерживает два варианта оформления:
 * primary — основная кнопка, outline — контурная (для тулбаров).
 *
 * @param roomId — ID комнаты
 * @param variant — стиль кнопки ('primary' | 'outline'), по умолчанию 'outline'
 */
import { Button } from '@/shared/ui';
import { useResetRoom } from '../lib/useResetRoom';

interface RoomControlsProps {
  roomId: string;
  variant?: 'primary' | 'outline';
}

export function RoomControls({ roomId, variant = 'outline' }: RoomControlsProps) {
  const { mutate, isPending } = useResetRoom(roomId);

  return (
    <Button onClick={() => mutate()} disabled={isPending} variant={variant} size="sm">
      {isPending ? 'Resetting...' : 'Reset Room'}
    </Button>
  );
}
