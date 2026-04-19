/**
 * Форма присоединения к комнате по ID.
 *
 * Поле ввода ID комнаты → переход на /room/:roomId.
 * Используется когда участник получает ссылку или код приглашения.
 *
 * В будущей реализации:
 *  - Валидация формата ID комнаты
 *  - Проверка существования комнаты через roomApi.getRoom()
 *  - Обработка ошибок (комната не найдена, уже завершена)
 */
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/app/providers';
import { roomApi } from '@/entities/room';
import { Input, Button } from '@/shared/ui';
import { SESSION_STORAGE_KEY, type DeckType, type GameSession } from '@/shared/lib/poker';

function normalizeDeckType(code: string | undefined): DeckType {
  return code === 'even' ? 'even' : 'fibonacci';
}

export function JoinRoomForm() {
  const [roomId, setRoomId] = useState('');
  const { user } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const joinMutation = useMutation({
    mutationFn: (code: string) => roomApi.joinRoomByCode(code),
    onSuccess: (snapshot) => {
      const session: GameSession = {
        roomId: snapshot.room.slug,
        roomName: snapshot.room.name,
        userName: user?.name?.trim() || 'Гость',
        ownerId: snapshot.room.owner_id,
        ownerName: 'Владелец комнаты',
        deckType: normalizeDeckType(snapshot.room.deck?.code),
      };

      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      navigate(`/room/${snapshot.room.slug}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim() || joinMutation.isPending) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    joinMutation.mutate(roomId.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Код комнаты"
        placeholder="Например, ABCD"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        maxLength={4}
        disabled={joinMutation.isPending}
      />
      <Button type="submit" disabled={!roomId.trim() || joinMutation.isPending}>
        {joinMutation.isPending ? 'Входим...' : 'Войти в комнату'}
      </Button>
      {joinMutation.isError && (
        <p className="text-sm text-destructive">Комната с таким кодом не найдена или недоступна.</p>
      )}
    </form>
  );
}
