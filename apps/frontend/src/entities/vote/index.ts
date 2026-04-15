/**
 * Barrel-экспорт сущности «Голос».
 *
 * Экспортирует:
 *  - VoteDisplay — UI-компонент отображения карты
 *  - VoteValue, Vote — типы данных
 *  - VOTE_LABELS — маппинг значений на подписи
 */
export { VoteDisplay } from './ui/VoteDisplay';
export type { VoteValue, Vote } from './model/types';
export { VOTE_LABELS } from './model/types';
