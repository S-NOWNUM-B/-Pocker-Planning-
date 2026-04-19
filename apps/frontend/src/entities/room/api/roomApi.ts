/**
 * Room API — операции с комнатами через REST API.
 *
 * Использует общий axios-клиент из shared/api.
 *
 * Методы:
 *  - getRoom(roomId) — GET /rooms/:roomId — получить данные комнаты
 *  - createRoom(name) — POST /rooms — создать новую комнату
 *  - updateRoomStatus(roomId, status) — PATCH /rooms/:roomId/status — изменить статус
 *  - resetRoom(roomId) — POST /rooms/:roomId/reset — сбросить голоса
 *
 * Типы данных: RoomState, RoomDetails из entities/room/model/types.
 */
import { api } from '@/shared/api';
import type { RoomState, RoomDetails, RoomListItem, RoomSnapshot } from '../model/types';

export const roomApi = {
  listRooms: async (): Promise<RoomListItem[]> => {
    const { data } = await api.get('/rooms');
    return data;
  },

  getRoom: async (roomId: string): Promise<RoomDetails> => {
    const { data } = await api.get(`/rooms/${roomId}`);
    return data;
  },

  getRoomSnapshot: async (roomId: string): Promise<RoomSnapshot> => {
    const { data } = await api.get(`/rooms/${roomId}`);
    return data;
  },

  createRoom: async (
    name: string,
    deckPresetCode: 'fibonacci' | 'even' = 'fibonacci',
  ): Promise<RoomSnapshot> => {
    const { data } = await api.post('/rooms', { name, deck_preset_code: deckPresetCode });
    return data;
  },

  joinRoomByCode: async (roomCode: string): Promise<RoomSnapshot> => {
    const { data } = await api.post(`/rooms/code/${roomCode}/join`);
    return data;
  },

  joinRoomByInvitation: async (token: string): Promise<RoomSnapshot> => {
    const { data } = await api.post(`/invitations/${token}/join`);
    return data;
  },

  deleteRoom: async (roomId: string): Promise<void> => {
    await api.delete(`/rooms/${roomId}`);
  },

  createTask: async (roomId: string, title: string): Promise<void> => {
    await api.post(`/rooms/${roomId}/tasks`, { title });
  },

  selectTask: async (roomId: string, taskId: string): Promise<void> => {
    await api.post(`/rooms/${roomId}/tasks/select`, { task_id: taskId });
  },

  startRound: async (roomId: string, taskId: string): Promise<RoomSnapshot> => {
    const { data } = await api.post(`/rooms/${roomId}/rounds/start`, { task_id: taskId });
    return data;
  },

  submitVote: async (roomId: string, roundId: string, value: string): Promise<void> => {
    await api.post(`/rooms/${roomId}/rounds/${roundId}/vote`, { value });
  },

  revealRound: async (roomId: string, roundId: string): Promise<RoomSnapshot> => {
    const { data } = await api.post(`/rooms/${roomId}/rounds/${roundId}/reveal`);
    return data;
  },

  finalizeRound: async (roomId: string, roundId: string, resultValue?: string): Promise<RoomSnapshot> => {
    const { data } = await api.post(`/rooms/${roomId}/rounds/${roundId}/finalize`, {
      result_value: resultValue ?? null,
    });
    return data;
  },

  updateRoomStatus: async (roomId: string, status: RoomState['status']): Promise<RoomDetails> => {
    const { data } = await api.patch(`/rooms/${roomId}/status`, { status });
    return data;
  },

  resetRoom: async (roomId: string): Promise<RoomDetails> => {
    const { data } = await api.post(`/rooms/${roomId}/reset`);
    return data;
  },
};
