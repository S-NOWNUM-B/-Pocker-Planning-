/**
 * Barrel-экспорт сущности «Комната».
 *
 * Экспортирует:
 *  - RoomStatusBadge — UI-компонент бейджа статуса
 *  - RoomState, RoomStatus, RoomDetails — типы данных
 *  - roomApi — REST API для работы с комнатами
 *  - statusLabels, getRoomStatusColor, isRoomActive — селекторы и утилиты
 */
export { RoomStatusBadge } from './ui/RoomStatusBadge';
export type { RoomState, RoomStatus, RoomDetails } from './model/types';
export { roomApi } from './api/roomApi';
export { statusLabels, getRoomStatusColor, isRoomActive } from './model/selectors';
