import { type HTMLAttributes, type ReactNode } from 'react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ children, isOpen, onClose, title, className = '', ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              className="bg-none border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-700 p-1"
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
