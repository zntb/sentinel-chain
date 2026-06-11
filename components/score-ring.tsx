import { cn } from '@/lib/utils';

function scoreColor(score: number): string {
  if (score >= 90) return 'text-safe';
  if (score >= 75) return 'text-low';
  if (score >= 55) return 'text-medium';
  if (score >= 35) return 'text-high';
  return 'text-critical';
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 12,
  label,
  showLabel = true,
  className,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className='-rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          className='stroke-muted'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'stroke-current transition-all duration-1000 ease-out',
            color,
          )}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        {showLabel && (
          <span
            className={cn('font-bold tabular-nums', color)}
            style={{ fontSize: Math.max(11, size * 0.28) }}
          >
            {score}
          </span>
        )}
        {label && showLabel && (
          <span className='text-xs font-medium text-muted-foreground'>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
