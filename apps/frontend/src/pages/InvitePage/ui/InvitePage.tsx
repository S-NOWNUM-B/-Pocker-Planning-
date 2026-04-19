import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { roomApi } from '@/entities/room';
import { PageShell, Spinner } from '@/shared/ui';
import { SESSION_STORAGE_KEY, type DeckType, type GameSession } from '@/shared/lib/poker';
import { useSession } from '@/app/providers';

function normalizeDeckType(code: string | undefined): DeckType {
  return code === 'even' ? 'even' : 'fibonacci';
}

export function InvitePage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { user } = useSession();

  const joinMutation = useMutation({
    mutationFn: (invitationToken: string) => roomApi.joinRoomByInvitation(invitationToken),
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
      navigate(`/room/${snapshot.room.slug}`, { replace: true });
    },
    onError: () => {
      navigate('/join-room', { replace: true });
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!token) {
      navigate('/join-room', { replace: true });
      return;
    }

    joinMutation.mutate(token);
  }, [joinMutation, navigate, token, user]);

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
