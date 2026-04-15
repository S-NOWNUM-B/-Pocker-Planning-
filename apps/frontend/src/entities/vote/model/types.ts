/**
 * Типы данных сущности «Голос».
 *
 * VoteValue — возможные значения карт (Фибоначчи, чётная, ?, ☕).
 * Vote — запись голоса: участник, значение, время.
 * VOTE_LABELS — маппинг значений на человеко-читаемые подписи.
 */
import type { VoteValue } from '@poker/shared';

export type { VoteValue };

export interface Vote {
  participantId: string;
  value: VoteValue;
  timestamp: string;
}

export const VOTE_LABELS: Record<VoteValue, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '8': '8',
  '10': '10',
  '12': '12',
  '13': '13',
  '14': '14',
  '16': '16',
  '18': '18',
  '20': '20',
  '21': '21',
  '34': '34',
  '55': '55',
  '89': '89',
  '?': '?',
  coffee: '☕',
};
