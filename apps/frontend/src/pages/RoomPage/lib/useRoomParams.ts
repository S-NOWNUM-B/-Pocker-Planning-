import { useParams } from 'react-router-dom';

export function useRoomParams() {
  const params = useParams<{ roomId: string }>();

  if (!params.roomId) {
    throw new Error('Room ID is required');
  }

  return { roomId: params.roomId };
}
