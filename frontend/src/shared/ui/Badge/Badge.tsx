import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const colorMap = {
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  red: 'red',
  gray: 'gray',
};

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[colorMap[color]]}`}>
      {label}
    </span>
  );
}
