/**
 * Универсальная кнопка с поддержкой полиморфизма (проп as).
 *
 * Поддерживает несколько вариантов оформления и 3 размера.
 */
import { Button as HeadlessButton } from '@headlessui/react';
import { type ElementType, type ComponentPropsWithoutRef } from 'react';

export const baseButtonClasses =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-inherit font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

export const variantClasses = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/88 data-[hover]:bg-primary/88',
  secondary:
    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/78 data-[hover]:bg-secondary/78',
  outline:
    'border border-border bg-card/70 text-foreground hover:border-primary/62 hover:bg-secondary/80 data-[hover]:border-primary/62 data-[hover]:bg-secondary/80',
  card: 'aspect-[3/4] border border-border bg-card text-card-foreground text-xl shadow-sm hover:border-primary/62 hover:bg-card/85 data-[hover]:border-primary/62 data-[hover]:bg-card/85',
  subtle: 'bg-secondary/50 text-foreground hover:bg-secondary/82 data-[hover]:bg-secondary/82',
  ghost: 'bg-transparent text-foreground/85 hover:bg-secondary/72 data-[hover]:bg-secondary/72',
  danger:
    'border border-destructive/30 bg-destructive/12 text-destructive hover:bg-destructive hover:text-white data-[hover]:bg-destructive data-[hover]:text-white',
};

export const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

type ButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  isLoading?: boolean;
  className?: string;
};

export type ButtonProps<E extends ElementType = 'button'> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps>;

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps<E>) {
  const classes = `${baseButtonClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );

  if (!as) {
    return (
      <HeadlessButton className={classes} disabled={isDisabled} {...(props as ComponentPropsWithoutRef<'button'>)}>
        {content}
      </HeadlessButton>
    );
  }

  const Component = as as ElementType;
  const componentProps = { ...props, disabled: isDisabled } as Record<string, unknown>;

  return <Component {...componentProps} className={classes}>{content}</Component>;
}
