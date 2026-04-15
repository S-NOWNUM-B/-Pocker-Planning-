/**
 * Утилита для условного объединения CSS-классов.
 *
 * Аналог clsx/cx — фильтрует ложные значения (null, undefined, false)
 * и объединяет оставшиеся строки через пробел.
 *
 * @example
 * cn('btn', isActive && 'btn-active', size === 'lg' && 'btn-lg')
 * // → 'btn btn-active btn-lg'
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
