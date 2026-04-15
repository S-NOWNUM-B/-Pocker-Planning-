/**
 * Бейдж — цветная метка со статусом.
 *
 * Отображает текст на цветном фоне в виде скруглённой плашки.
 * Пять цветов: blue, green, yellow, red, gray.
 *
 * Используется в RoomStatusBadge для отображения статуса комнаты.
 *
 * @param label — текст бейджа
 * @param color — цвет бейджа (по умолчанию 'gray')
 */
const colorClasses = {
  blue: 'border border-blue-500/25 bg-blue-500/12 text-blue-700 dark:text-blue-300',
  green: 'border border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  yellow: 'border border-amber-500/25 bg-amber-500/12 text-amber-700 dark:text-amber-300',
  red: 'border border-red-500/25 bg-red-500/12 text-red-700 dark:text-red-300',
  gray: 'border border-border bg-secondary/55 text-secondary-foreground',
};

export type BadgeColor = keyof typeof colorClasses;

export interface BadgeProps {
  label: string;
  color?: BadgeColor;
}

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}
