import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldCheck } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
        <HugeiconsIcon icon={ShieldCheck} size={20} strokeWidth={1.5} />
      </div>
      {showText && (
        <span className='text-lg font-semibold tracking-tight'>
          Sentinel<span className='text-primary'>Chain</span>
        </span>
      )}
    </div>
  );
}
