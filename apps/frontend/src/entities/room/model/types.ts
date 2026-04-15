/**
 * Типы данных сущности «Комната».
 *
 * RoomState — базовое состояние комнаты (импортируется из @poker/shared).
 * RoomStatus — статус комнаты: 'waiting' | 'voting' | 'revealed'.
 * RoomDetails — расширенная информация: createdAt, moderatorId.
 */
import type { RoomState, RoomStatus } from '@poker/shared';

export type { RoomState, RoomStatus };

export interface RoomDetails extends RoomState {
  createdAt: string;
  moderatorId: string;
}
