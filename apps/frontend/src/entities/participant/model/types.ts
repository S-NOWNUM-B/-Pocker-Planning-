/**
 * Типы данных сущности «Участник».
 *
 * Participant — базовый участник (id, name, hasVoted).
 * ParticipantWithVote — расширенный участник с информацией о голосе
 * и флагом раскрытия результатов.
 */
import type { Participant } from '@poker/shared';

export type { Participant };

export interface ParticipantWithVote extends Participant {
  vote?: string;
  isRevealed?: boolean;
}
