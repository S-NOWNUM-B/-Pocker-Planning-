/**
 * Barrel-экспорт сущности «Участник».
 *
 * Экспортирует:
 *  - ParticipantCard — UI-компонент карточки участника
 *  - Participant, ParticipantWithVote — типы данных
 *  - hasVoted, getInitials, sortParticipants — селекторы и утилиты
 */
export { ParticipantCard } from './ui/ParticipantCard';
export type { Participant, ParticipantWithVote } from './model/types';
export { hasVoted, getInitials, sortParticipants } from './model/selectors';
