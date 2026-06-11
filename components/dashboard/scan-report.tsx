'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft,
  Bookmark,
  BadgeCheck,
  Bot,
  Code,
  Copy,
  ShieldAlert,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/dashboard-topbar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScoreRing } from '@/components/score-ring';
import { VulnerabilityCard } from '@/components/dashboard/vulnerability-card';
import {
  CategoryRadar,
  SeverityChart,
} from '@/components/dashboard/scan-charts';
import { AiAssistant } from '@/components/dashboard/ai-assistant';
import { ReportGenerator } from '@/components/dashboard/report-generator';
import { CodeViewer } from '@/components/dashboard/code-viewer';
import {
  DEMO_CONTRACT_CODE,
  formatDate,
  riskLevelColor,
  shortAddress,
  type ScanResult,
} from '@/lib/scanner-data';

const CODE_MARKERS = [
  { line: 2, severity: 'low' as const, title: 'Outdated compiler' },
  { line: 19, severity: 'critical' as const, title: 'Reentrancy' },
  { line: 25, severity: 'high' as const, title: 'Missing access control' },
  { line: 30, severity: 'medium' as const, title: 'Weak randomness' },
  {
    line: 35,
    severity: 'critical' as const,
    title: 'Unprotected selfdestruct',
  },
];

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className='rounded-lg border border-border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${tone ?? ''}`}>
        {value}
      </p>
    </div>
  );
}

export function ScanReport({ scan }: { scan: ScanResult }) {
  const [saved, setSaved] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(scan.address);
    toast.success('Address copied');
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <a
          href='/dashboard/history'
          className={
            (buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 mb-2')
          }
        >
          <HugeiconsIcon icon={ArrowLeft} className='size-4' />
          Back to history
        </a>
        <PageHeader
          title={scan.contractName}
          description='Security analysis report'
        >
          <Button
            variant='outline'
            onClick={() => {
              setSaved(s => !s);
              toast.success(saved ? 'Removed from saved' : 'Saved contract');
            }}
          >
            <HugeiconsIcon
              icon={Bookmark}
              className={saved ? 'size-4 fill-current' : 'size-4'}
            />
            {saved ? 'Saved' : 'Save'}
          </Button>
          <ReportGenerator scan={scan} />
        </PageHeader>
      </div>

      <div className='flex flex-wrap items-center gap-2 text-sm'>
        <button
          onClick={copyAddress}
          className='inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs hover:bg-muted/40'
        >
          {shortAddress(scan.address)}
          <HugeiconsIcon icon={Copy} className='size-3 text-muted-foreground' />
        </button>
        <Badge variant='secondary'>{scan.network}</Badge>
        {scan.verified ? (
          <Badge className='gap-1 bg-safe/15 text-safe'>
            <HugeiconsIcon icon={BadgeCheck} className='size-3.5' /> Verified
          </Badge>
        ) : (
          <Badge variant='outline' className='gap-1 text-muted-foreground'>
            Unverified source
          </Badge>
        )}
        <span className='text-muted-foreground'>
          Scanned {formatDate(scan.scannedAt)}
        </span>
      </div>

      <Tabs defaultValue='overview'>
        <TabsList className='flex w-full flex-wrap justify-start'>
          <TabsTrigger value='overview'>
            <HugeiconsIcon icon={ShieldAlert} className='size-4' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='vulnerabilities'>
            Findings ({scan.totalVulnerabilities})
          </TabsTrigger>
          <TabsTrigger value='assistant'>
            <HugeiconsIcon icon={Bot} className='size-4' />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value='code'>
            <HugeiconsIcon icon={Code} className='size-4' />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-6 flex flex-col gap-6'>
          <div className='grid gap-6 lg:grid-cols-3'>
            <Card className='flex flex-col items-center justify-center gap-3 p-6 text-center'>
              <h2 className='self-start text-sm font-medium text-muted-foreground'>
                Security score
              </h2>
              <ScoreRing score={scan.securityScore} label='/ 100' size={180} />
              <p
                className={`text-lg font-semibold ${riskLevelColor(
                  scan.riskLevel,
                )}`}
              >
                {scan.riskLevel}
              </p>
            </Card>

            <div className='grid grid-cols-2 gap-4 lg:col-span-2'>
              <StatTile
                label='Total vulnerabilities'
                value={scan.totalVulnerabilities}
              />
              <StatTile
                label='Critical issues'
                value={scan.criticalIssues}
                tone='text-critical'
              />
              <StatTile
                label='Gas optimizations'
                value={scan.gasIssues}
                tone='text-low'
              />
              <StatTile
                label='Code quality'
                value={scan.qualityIssues}
                tone='text-medium'
              />
              <Card className='col-span-2 p-4'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>Contract complexity</p>
                  <span className='text-sm font-semibold tabular-nums'>
                    {scan.complexity}/100
                  </span>
                </div>
                <Progress value={scan.complexity} className='mt-3' />
                <p className='mt-2 text-xs text-muted-foreground'>
                  Higher complexity increases audit surface and risk.
                </p>
              </Card>
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-2'>
            <Card className='p-6'>
              <h3 className='font-semibold'>Findings by severity</h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                Distribution of detected issues.
              </p>
              <div className='mt-4'>
                <SeverityChart scan={scan} />
              </div>
            </Card>
            <Card className='p-6'>
              <h3 className='font-semibold'>Category breakdown</h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                Score across security categories.
              </p>
              <div className='mt-4'>
                <CategoryRadar scan={scan} />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value='vulnerabilities'
          className='mt-6 flex flex-col gap-3'
        >
          {scan.vulnerabilities.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <VulnerabilityCard vuln={v} />
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value='assistant' className='mt-6'>
          <Card className='p-0'>
            <AiAssistant scan={scan} />
          </Card>
        </TabsContent>

        <TabsContent value='code' className='mt-6 flex flex-col gap-4'>
          <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
            <span>
              Risky lines are highlighted by severity. Hover for details.
            </span>
          </div>
          <CodeViewer code={DEMO_CONTRACT_CODE} markers={CODE_MARKERS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
