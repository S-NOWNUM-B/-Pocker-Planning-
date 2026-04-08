import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${styles[sizeMap[size]]}`} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
