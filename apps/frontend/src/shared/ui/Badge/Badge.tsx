/**
 * Бейдж — цветная метка со статусом.
 *
 * Отображает текст на цветном фоне в виде скруглённой плашки.
 * Пять цветов: blue, green, yellow, red, gray.
 * Две формы: pill (rounded-full) и rounded (rounded-lg).
 *
 * Используется в RoomStatusBadge для отображения статуса комнаты.
 *
 * @param label — текст бейджа
 * @param color — цвет бейджа (по умолчанию 'gray')
 * @param shape — форма бейджа: 'pill' (rounded-full) или 'rounded' (rounded-lg), по умолчанию 'pill'
 */
const colorClasses = {
  blue: 'border border-blue-500/25 bg-blue-500/12 text-blue-700 dark:text-blue-300',
  green: 'border border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  yellow: 'border border-amber-500/25 bg-amber-500/12 text-amber-700 dark:text-amber-300',
  red: 'border border-red-500/25 bg-red-500/12 text-red-700 dark:text-red-300',
  gray: 'border border-border bg-secondary/55 text-secondary-foreground',
  primary: 'bg-primary text-primary-foreground',
};

export type BadgeColor = keyof typeof colorClasses;

export interface BadgeProps {
  label: string;
  color?: BadgeColor;
  shape?: 'pill' | 'rounded';
}

export function Badge({ label, color = 'gray', shape = 'pill' }: BadgeProps) {
  const shapeClass = shape === 'pill' ? 'rounded-full' : 'rounded-lg';

  return (
    <span
      className={`inline-block ${shapeClass} px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}
