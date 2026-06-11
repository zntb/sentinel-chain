'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertTriangle,
  ArrowRight,
  Warning,
  GaugeIcon,
  ScanLine,
  ShieldCheck,
} from '@hugeicons/core-free-icons';
import { PageHeader } from '@/components/dashboard/dashboard-topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScoreRing } from '@/components/score-ring';
import {
  DEMO_SCAN,
  SCAN_HISTORY,
  formatDate,
  riskLevelColor,
  shortAddress,
} from '@/lib/scanner-data';

const STAT_CARDS = [
  {
    label: 'Contracts scanned',
    value: SCAN_HISTORY.length.toString(),
    icon: ScanLine,
    tone: 'text-primary',
  },
  {
    label: 'Open critical issues',
    value: '3',
    icon: AlertTriangle,
    tone: 'text-critical',
  },
  {
    label: 'Avg. security score',
    value: '65',
    icon: GaugeIcon,
    tone: 'text-medium',
  },
  {
    label: 'Reports generated',
    value: '4',
    icon: Warning,
    tone: 'text-low',
  },
];

export default function DashboardPage() {
  return (
    <div className='flex flex-col gap-6'>
      <PageHeader
        title='Dashboard'
        description='Overview of your contract security posture.'
      >
        <Button>
          <Link href='/dashboard/new'>
            <HugeiconsIcon icon={ArrowRight} className='size-4' />
            New scan
          </Link>
        </Button>
      </PageHeader>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className='p-5'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>{s.label}</span>
                <HugeiconsIcon icon={s.icon} className={`size-4 ${s.tone}`} />
              </div>
              <div className='mt-3 text-3xl font-bold tracking-tight'>
                {s.value}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='flex flex-col items-center justify-center gap-4 p-6 text-center'>
          <h2 className='self-start text-sm font-medium text-muted-foreground'>
            Latest scan score
          </h2>
          <ScoreRing score={DEMO_SCAN.securityScore} label='/ 100' />
          <div>
            <p className='font-semibold'>{DEMO_SCAN.contractName}</p>
            <p
              className={`text-sm font-medium ${riskLevelColor(
                DEMO_SCAN.riskLevel,
              )}`}
            >
              {DEMO_SCAN.riskLevel}
            </p>
          </div>
          <Button variant='outline' size='sm' className='w-full'>
            <Link href={`/dashboard/scan/${DEMO_SCAN.id}`}>
              View report
              <HugeiconsIcon icon={ArrowRight} className='size-4' />
            </Link>
          </Button>
        </Card>

        <Card className='p-6 lg:col-span-2'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold'>Recent scans</h2>
            <Button variant='ghost' size='sm'>
              <Link href='/dashboard/history'>
                View all
                <HugeiconsIcon icon={ArrowRight} className='size-4' />
              </Link>
            </Button>
          </div>
          <div className='mt-4 flex flex-col divide-y divide-border'>
            {SCAN_HISTORY.slice(0, 5).map(s => (
              <Link
                key={s.id}
                href={`/dashboard/scan/${s.id}`}
                className='flex items-center gap-4 py-3 transition-colors hover:bg-muted/40 -mx-2 rounded-md px-2'
              >
                <div className='flex size-9 items-center justify-center rounded-lg bg-muted'>
                  <HugeiconsIcon
                    icon={ShieldCheck}
                    className='size-4 text-muted-foreground'
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>
                    {s.contractName}
                  </p>
                  <p className='truncate font-mono text-xs text-muted-foreground'>
                    {shortAddress(s.address)} · {s.network}
                  </p>
                </div>
                <div className='hidden text-right sm:block'>
                  <p className='text-xs text-muted-foreground'>
                    {formatDate(s.scannedAt)}
                  </p>
                </div>
                <div className='flex w-16 flex-col items-end'>
                  <span className='text-sm font-bold tabular-nums'>
                    {s.securityScore}
                  </span>
                  <span
                    className={`text-xs font-medium ${riskLevelColor(
                      s.riskLevel,
                    )}`}
                  >
                    {s.riskLevel.replace(' Risk', '')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
