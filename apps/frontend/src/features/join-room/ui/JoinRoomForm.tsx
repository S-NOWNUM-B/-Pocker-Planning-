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
import { loginAsGuest } from '@/entities/user';
import { roomApi } from '@/entities/room';
import { Input, Button } from '@/shared/ui';
import { SESSION_STORAGE_KEY, type DeckType, type GameSession } from '@/shared/lib/poker';

function normalizeDeckType(code: string | undefined): DeckType {
  if (code === 'even') {
    return 'even';
  }

  if (code === 'tshirt') {
    return 'tshirt';
  }

  return 'fibonacci';
}

export function JoinRoomForm() {
  const [roomId, setRoomId] = useState('');
  const { user } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getSession = (): GameSession | null => {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as GameSession;
    } catch {
      return null;
    }
  };

  const ensureRoomAccessToken = async (): Promise<{ token?: string; guestName?: string }> => {
    if (user) {
      return {};
    }

    const existingSession = getSession();
    if (existingSession?.roomAccessToken) {
      return { token: existingSession.roomAccessToken, guestName: existingSession.userName };
    }

    const guestAuth = await loginAsGuest({ name: 'Гость' });
    return { token: guestAuth.access_token, guestName: guestAuth.user.name };
  };

  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const roomAccess = await ensureRoomAccessToken();
      const snapshot = await roomApi.joinRoomByCode(code, roomAccess.token);
      return { snapshot, roomAccessToken: roomAccess.token, guestName: roomAccess.guestName };
    },
    onSuccess: ({ snapshot, roomAccessToken, guestName }) => {
      const session: GameSession = {
        roomId: snapshot.room.slug,
        roomName: snapshot.room.name,
        userName: user?.name?.trim() || guestName || 'Гость',
        ownerId: snapshot.room.owner_id,
        ownerName: 'Владелец комнаты',
        deckType: normalizeDeckType(snapshot.room.deck?.code),
        roomAccessToken,
        selfParticipantId: snapshot.self_participant_id,
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
