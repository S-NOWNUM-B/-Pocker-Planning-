/**
 * Индикатор загрузки (спиннер).
 *
 * Вращающийся круг с тремя размерами: sm (20px), md (32px), lg (48px).
 * Опциональная текстовая подпись.
 *
 * @param size — размер спиннера ('sm' | 'md' | 'lg'), по умолчанию 'md'
 * @param label — текстовая подпись под спиннером
 */
const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-3 border-border border-t-primary ${sizeClasses[size]}`}
        style={{ borderWidth: '3px' }}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
