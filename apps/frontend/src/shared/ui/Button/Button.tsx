/**
 * Универсальная кнопка.
 *
 * Поддерживает несколько вариантов оформления и 3 размера.
 * Пробрасывает все стандартные атрибуты button.
 */
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export const baseButtonClasses =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-inherit font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

export const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
  outline:
    'border border-border bg-card/70 text-foreground hover:border-primary/55 hover:bg-secondary/80',
  card: 'aspect-[3/4] border border-border bg-card text-card-foreground text-xl hover:border-primary/55 hover:bg-card/85',
  subtle: 'bg-secondary/50 text-foreground hover:bg-secondary/80',
  ghost: 'bg-transparent text-foreground/85 hover:bg-secondary/70',
  danger: 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white',
};

export const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseButtonClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
