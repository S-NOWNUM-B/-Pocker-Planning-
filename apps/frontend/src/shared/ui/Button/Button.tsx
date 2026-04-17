/**
 * Универсальная кнопка.
 *
 * Поддерживает 5 вариантов оформления (primary, secondary, outline, card, ghost)
 * и 3 размера (sm, md, lg). Пробрасывает все стандартные атрибуты button.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>Нажми</Button>
 *
 * @param variant — стиль кнопки
 * @param size — размер кнопки
 * @param className — дополнительный CSS-класс
 */
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-border bg-card/70 text-foreground hover:border-primary/55 hover:bg-secondary/60',
  card: 'aspect-[3/4] border border-border bg-card text-card-foreground text-xl hover:border-primary/55 hover:bg-card/90',
  ghost: 'bg-transparent text-foreground/85 hover:bg-secondary/60',
};

export const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'card' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-inherit font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
