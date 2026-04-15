/**
 * Модальное окно.
 *
 * Фиксированный оверлей с центрированной карточкой.
 * Закрывается по клику на оверлей или на кнопку «×».
 *
 * @param isOpen — открыто ли модальное окно
 * @param onClose — обработчик закрытия
 * @param title — заголовок (опционально)
 * @param children — содержимое модального окна
 * @param className — дополнительный CSS-класс
 */
import { type HTMLAttributes, type ReactNode } from 'react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ children, isOpen, onClose, title, className = '', ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/55 px-4"
      onClick={onClose}
    >
      <div
        className={`max-h-[90vh] w-full max-w-125 overflow-y-auto rounded-2xl border border-border/70 bg-card p-6 text-card-foreground shadow-2xl ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              className="cursor-pointer rounded-md p-1 text-xl leading-none text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
