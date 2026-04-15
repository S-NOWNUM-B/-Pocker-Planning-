/**
 * Селекторы и утилиты для сущности «Участник».
 *
 * hasVoted(participant) — проголосовал ли участник.
 * getInitials(name) — инициалы из имени (макс. 2 буквы).
 * sortParticipants(a, b) — сортировка: проголосовавшие первыми, затем по имени.
 */
import type { Participant } from '@poker/shared';

export function hasVoted(participant: Participant): boolean {
  return participant.hasVoted;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function sortParticipants(a: Participant, b: Participant): number {
  if (a.hasVoted && !b.hasVoted) return -1;
  if (!a.hasVoted && b.hasVoted) return 1;
  return a.name.localeCompare(b.name);
}
