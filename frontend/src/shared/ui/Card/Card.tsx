import { type HTMLAttributes, type ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({
  className = '',
  variant = 'default',
  children,
  ...props
}: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
