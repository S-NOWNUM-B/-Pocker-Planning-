/**
 * Визуальное отображение голоса (карты).
 *
 * Рендерит карту заданного размера с значением или «?» если не раскрыта.
 * Три размера: sm (список), md (результаты), lg (выбор карты).
 *
 * @param value — значение карты (VoteValue)
 * @param size — размер ('sm' | 'md' | 'lg'), по умолчанию 'md'
 * @param revealed — раскрыта ли карта (по умолчанию true)
 */
import { VOTE_LABELS } from '../model/types';
import type { VoteValue } from '@poker/shared';

const sizeClasses = {
  sm: 'w-10 h-14 text-base',
  md: 'w-[60px] h-21 text-xl',
  lg: 'w-20 h-28 text-2xl',
};

interface VoteDisplayProps {
  value: VoteValue;
  size?: 'sm' | 'md' | 'lg';
  revealed?: boolean;
}

export function VoteDisplay({ value, size = 'md', revealed = true }: VoteDisplayProps) {
  const label = VOTE_LABELS[value];

  return (
    <div
      className={`inline-flex items-center justify-center font-semibold rounded-lg border-2 ${
        revealed
          ? 'bg-white border-gray-300 text-gray-900'
          : 'bg-indigo-500 text-white border-indigo-500'
      } ${sizeClasses[size]}`}
    >
      {revealed ? label : '?'}
    </div>
  );
}
