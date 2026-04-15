/**
 * Селекторы и утилиты для сущности «Комната».
 *
 * statusLabels — словарь подписей статусов (waiting → 'Waiting' и т.д.).
 * getRoomStatusColor — возвращает цвет бейджа по статусу (blue/yellow/green).
 * isRoomActive — проверяет, активна ли комната (статус voting или waiting).
 */
import type { RoomState, RoomStatus } from '@poker/shared';

export const statusLabels: Record<RoomStatus, string> = {
  waiting: 'Waiting',
  voting: 'Voting',
  revealed: 'Revealed',
};

export function getRoomStatusColor(status: RoomStatus): string {
  const colorMap: Record<RoomStatus, string> = {
    waiting: 'blue',
    voting: 'yellow',
    revealed: 'green',
  };
  return colorMap[status];
}

export function isRoomActive(room: RoomState): boolean {
  return room.status === 'voting' || room.status === 'waiting';
}
