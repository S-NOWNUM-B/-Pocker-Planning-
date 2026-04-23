/**
 * Barrel-экспорт сущности «Комната».
 *
 * Экспортирует:
 *  - RoomCard — UI-компонент карточки комнаты
 *  - RoomState, RoomStatus, RoomDetails, RoomListItem — типы данных
 *  - roomApi — REST API для работы с комнатами
 *  - statusLabels, getRoomStatusColor, isRoomActive — селекторы и утилиты
 */
export { RoomCard } from './ui/RoomCard';
export type { RoomState, RoomStatus, RoomDetails, RoomListItem } from './model/types';
export { roomApi } from './api/roomApi';
export { statusLabels, getRoomStatusColor, isRoomActive } from './model/selectors';
