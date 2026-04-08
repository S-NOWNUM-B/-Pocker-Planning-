import { type ButtonHTMLAttributes, forwardRef } from 'react';

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-indigo-500 text-white hover:bg-indigo-600',
  outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-blue-500',
  card: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-500 aspect-[3/4] text-xl',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'card' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium border-none rounded-lg cursor-pointer transition-all font-inherit disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
