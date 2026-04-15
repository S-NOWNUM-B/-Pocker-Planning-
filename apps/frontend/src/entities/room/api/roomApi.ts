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
import type { RoomState, RoomDetails } from '../model/types';

export const roomApi = {
  getRoom: async (roomId: string): Promise<RoomDetails> => {
    const { data } = await api.get(`/rooms/${roomId}`);
    return data;
  },

  createRoom: async (name: string): Promise<RoomDetails> => {
    const { data } = await api.post('/rooms', { name });
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
