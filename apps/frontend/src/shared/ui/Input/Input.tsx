/**
 * Поле ввода с опциональной подписью и сообщением об ошибке.
 *
 * Обёртка над <input> с лейаутом: label → input → error.
 * Автоматически генерирует id из label, если не передан.
 *
 * @param label — подпись над полем
 * @param error — текст ошибки под полем
 * @param id — id элемента (генерируется из label если не указан)
 */
import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className="rounded-lg border border-input bg-input px-3.5 py-2.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/80 focus:border-primary/65 focus:outline-none"
          {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
