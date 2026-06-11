'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Plus, Search } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function DashboardTopbar() {
  return (
    <header className='sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6'>
      <SidebarTrigger />
      <Separator orientation='vertical' className='h-6' />
      <div className='relative hidden flex-1 sm:block sm:max-w-sm'>
        <HugeiconsIcon
          icon={Search}
          className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
        />
        <Input
          placeholder='Search contracts, scans...'
          className='pl-9'
          aria-label='Search'
        />
      </div>
      <div className='flex flex-1 items-center justify-end gap-2 sm:flex-none'>
        <Button size='sm'>
          <Link href='/dashboard/new'>
            <HugeiconsIcon icon={Plus} className='size-4' />
            New scan
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
        {description && (
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {children && <div className='flex items-center gap-2'>{children}</div>}
    </div>
  );
}
