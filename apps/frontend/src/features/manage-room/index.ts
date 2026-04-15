/**
 * Экспорт фичи управления комнатой.
 *
 * RoomControls — кнопка сброса голосования.
 * useResetRoom — хук для вызова POST /rooms/:roomId/reset.
 */
export { RoomControls } from './ui/RoomControls';
export { useResetRoom } from './lib/useResetRoom';
