import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { roomApi } from '@/entities/room';
import { loginAsGuest } from '@/entities/user';
import { PageShell, Spinner } from '@/shared/ui';
import { SESSION_STORAGE_KEY, type DeckType, type GameSession } from '@/shared/lib/poker';
import { useSession } from '@/app/providers';

function normalizeDeckType(code: string | undefined): DeckType {
  if (code === 'even') {
    return 'even';
  }

  if (code === 'tshirt') {
    return 'tshirt';
  }

  return 'fibonacci';
}

export function InvitePage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { user } = useSession();

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
    mutationFn: async (invitationToken: string) => {
      const roomAccess = await ensureRoomAccessToken();
      const snapshot = await roomApi.joinRoomByInvitation(invitationToken, roomAccess.token);
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
      navigate(`/room/${snapshot.room.slug}`, { replace: true });
    },
    onError: () => {
      navigate('/join-room', { replace: true });
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/join-room', { replace: true });
      return;
    }

    joinMutation.mutate(token);
  }, [joinMutation, navigate, token]);

  return (
    <PageShell className="min-h-[calc(100vh-8.5rem)]">
      <div className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Подключаем к комнате по приглашению...</p>
        </div>
      </div>
    </PageShell>
  );
}
