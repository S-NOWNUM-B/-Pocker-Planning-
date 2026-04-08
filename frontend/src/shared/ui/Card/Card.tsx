import { type HTMLAttributes, type ReactNode } from 'react';

const variantClasses = {
  default: 'bg-white border border-gray-300',
  elevated: 'bg-white shadow-md',
  outlined: 'bg-transparent border-2 border-gray-300',
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  return (
    <div className={`rounded-xl p-5 ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
