import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className="px-3.5 py-2.5 border-2 border-gray-300 rounded-lg text-base bg-white text-gray-900 transition-colors focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
