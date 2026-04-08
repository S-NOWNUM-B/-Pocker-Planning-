const colorClasses = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-800',
};

type BadgeColor = keyof typeof colorClasses;

interface BadgeProps {
  label: string;
  color?: BadgeColor;
}

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}
