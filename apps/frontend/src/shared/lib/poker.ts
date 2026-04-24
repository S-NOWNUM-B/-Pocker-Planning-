/**
 * Доменная логика и типы Planning Poker.
 *
 * Определяет:
 *  - DeckType — тип колоды ('fibonacci' | 'even' | 'tshirt')
 *  - Theme — тема оформления ('light' | 'dark')
 *  - Player — игрок с голосом и статусом
 *  - Task — задача с оценкой
 *  - GameSession — сессия игры (хранится в localStorage)
 *  - DECKS — конфигурация колод (массивы карт)
 *  - createRoomId() — генерация ID комнаты из названия
 *  - getAverageVote() — подсчёт среднего значения голосов
 */
export type DeckType = 'fibonacci' | 'even' | 'tshirt';

export type Theme = 'light' | 'dark';

export interface Player {
  id: string;
  name: string;
  role: string;
  vote: string | null;
  isOnline?: boolean;
  isThinking: boolean;
  isBot: boolean;
}

export interface Task {
  id: string;
  title: string;
  estimate: string | null;
}

export interface GameSession {
  roomId: string;
  roomName: string;
  userName: string;
  ownerId: string;
  ownerName: string;
  deckType: DeckType;
  roomAccessToken?: string;
  selfParticipantId?: string | null;
}

export const DECKS: Record<DeckType, string[]> = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'],
  even: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '?', '☕'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
};

export const DECK_LABELS: Record<DeckType, string> = {
  fibonacci: 'Фибоначчи',
  even: 'Чётная',
  tshirt: 'Футболки',
};

export function getDeckLabel(deckType: string | undefined): string {
  if (deckType === 'even') {
    return DECK_LABELS.even;
  }

  if (deckType === 'tshirt') {
    return DECK_LABELS.tshirt;
  }

  return DECK_LABELS.fibonacci;
}

export const SESSION_STORAGE_KEY = 'poker-planning:session';

export const THEME_STORAGE_KEY = 'poker-planning:theme';

export function createRoomId(roomName: string) {
  return (
    roomName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'room'
  );
}

export function getAverageVote(players: Player[]) {
  const numericVotes = players
    .map((player) => player.vote)
    .filter((vote): vote is string => vote !== null && vote !== '?' && vote !== '☕')
    .map(Number)
    .filter((vote) => !Number.isNaN(vote));

  if (numericVotes.length === 0) {
    return '0';
  }

  return Math.round(
    numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length,
  ).toString();
}
