import { cn } from '@/lib/utils';
import { SEVERITY_META, type Severity } from '@/lib/scanner-data';

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  const meta = SEVERITY_META[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        meta.bg,
        meta.text,
        meta.border,
        className,
      )}
    >
      <span className='size-1.5 rounded-full bg-current' aria-hidden />
      {meta.label}
    </span>
  );
}
