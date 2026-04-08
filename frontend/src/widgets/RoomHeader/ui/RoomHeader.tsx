import { RoomStatusBadge } from '@/entities/room';
import { RoomControls } from '@/features/manage-room';
import { RevealButton } from '@/features/reveal-votes';
import type { RoomState } from '@poker/shared';

interface RoomHeaderProps {
  room: RoomState;
  roomId: string;
  isModerator?: boolean;
}

export function RoomHeader({ room, roomId, isModerator = false }: RoomHeaderProps) {
  return (
    <header className="flex items-center justify-between p-5 bg-white border-b border-gray-300">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
        <RoomStatusBadge status={room.status} />
      </div>
      <div className="flex gap-2">
        {isModerator && room.status === 'voting' && <RevealButton roomId={roomId} />}
        {isModerator && room.status === 'revealed' && <RoomControls roomId={roomId} />}
      </div>
    </header>
  );
}
