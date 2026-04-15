/**
 * Barrel-экспорт сущностей слоя entities.
 *
 * Содержит три сущности: room (комната), participant (участник), vote (голос).
 * Каждая сущность экспортирует: UI-компоненты, типы, селекторы, API.
 *
 * Также экспортирует authApi и типы авторизации из user.
 */
export { RoomStatusBadge } from './room';
export type { RoomState, RoomStatus, RoomDetails } from './room';
export { roomApi, statusLabels, getRoomStatusColor, isRoomActive } from './room';

export { ParticipantCard } from './participant';
export type { Participant, ParticipantWithVote } from './participant';
export { hasVoted, getInitials, sortParticipants } from './participant';

export { VoteDisplay } from './vote';
export type { VoteValue, Vote } from './vote';
export { VOTE_LABELS } from './vote';

export * as authApi from './user';
export type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  LoginResponse,
  RegisterResponse,
} from './user';
