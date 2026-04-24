import type { RoomSnapshot } from '@/entities/room/model/types';
import { SESSION_STORAGE_KEY, type GameSession } from '@/shared/lib/poker';

interface PersistRoomSessionParams {
  snapshot: RoomSnapshot;
  authUserName?: string;
  localUserName?: string;
  roomAccessToken?: string;
}

export function persistRoomSession({
  snapshot,
  authUserName,
  localUserName,
  roomAccessToken,
}: PersistRoomSessionParams): void {
  const selfParticipant = snapshot.self_participant_id
    ? snapshot.participants.find((participant) => participant.id === snapshot.self_participant_id)
    : null;
  const userName = authUserName || selfParticipant?.name || localUserName || 'Гость';
  const isOwner = selfParticipant?.role === 'owner';

  const session: GameSession = {
    roomId: snapshot.room.slug,
    roomName: snapshot.room.name,
    userName,
    ownerId: snapshot.room.owner_id,
    ownerName: isOwner ? userName : 'Владелец комнаты',
    deckType:
      snapshot.room.deck.code === 'even'
        ? 'even'
        : snapshot.room.deck.code === 'tshirt'
          ? 'tshirt'
          : 'fibonacci',
    roomAccessToken,
    selfParticipantId: snapshot.self_participant_id,
  };

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
