'use client';

import { cn } from '@/lib/utils';
import { SEVERITY_META, type Severity } from '@/lib/scanner-data';

interface LineMarker {
  line: number;
  severity: Severity;
  title: string;
}

export function CodeViewer({
  code,
  markers = [],
}: {
  code: string;
  markers?: LineMarker[];
}) {
  const lines = code.split('\n');
  const markerMap = new Map<number, LineMarker>();
  for (const m of markers) markerMap.set(m.line, m);

  return (
    <div className='overflow-hidden rounded-xl border border-border bg-card'>
      <div className='flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5'>
        <span className='font-mono text-xs text-muted-foreground'>
          VulnerableVault.sol
        </span>
        <span className='text-xs text-muted-foreground'>
          {lines.length} lines
        </span>
      </div>
      <div className='overflow-auto'>
        <pre className='text-xs leading-6'>
          <code className='font-mono'>
            {lines.map((line, i) => {
              const n = i + 1;
              const marker = markerMap.get(n);
              const meta = marker ? SEVERITY_META[marker.severity] : null;
              return (
                <div
                  key={n}
                  className={cn(
                    'group flex items-start gap-3 px-4',
                    meta && `${meta.bg} border-l-2 ${meta.border}`,
                    !meta && 'border-l-2 border-transparent',
                  )}
                  title={marker?.title}
                >
                  <span className='w-8 shrink-0 select-none text-right text-muted-foreground/60'>
                    {n}
                  </span>
                  <span className='flex-1 whitespace-pre-wrap break-words'>
                    {line || ' '}
                  </span>
                  {meta && (
                    <span
                      className={cn(
                        'shrink-0 select-none text-[10px] font-medium uppercase',
                        meta.text,
                      )}
                    >
                      {meta.label}
                    </span>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
