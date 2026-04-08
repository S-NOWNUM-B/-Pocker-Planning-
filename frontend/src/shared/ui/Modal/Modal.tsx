import { type HTMLAttributes, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({
  children,
  isOpen,
  onClose,
  title,
  className = '',
  ...props
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.close} onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
