const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin ${sizeClasses[size]}`}
        style={{ borderWidth: '3px' }}
      />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}
