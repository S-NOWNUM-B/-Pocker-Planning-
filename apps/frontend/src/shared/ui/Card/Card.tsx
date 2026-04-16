/**
 * Контейнер-карточка с границей и фоном.
 *
 * Три варианта: default (с фоном), elevated (с тенью), outlined (без фона).
 * Используется как обёртка для группировки контента.
 *
 * @param variant — стиль карточки
 * @param children — содержимое
 * @param className — дополнительный CSS-класс
 */
import { type HTMLAttributes, type ReactNode } from 'react';

const variantClasses = {
  default: 'border border-border/70 bg-card',
  elevated: 'border border-border/60 bg-card shadow-md',
  outlined: 'border border-border/80 bg-transparent',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl p-5 text-card-foreground ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
