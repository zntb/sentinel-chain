'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRightIcon,
  BotIcon,
  FileText,
  GitCompareIcon,
  LayersIcon,
  ScanLine,
  ShieldAlert,
  UploadIcon,
  Workflow,
} from '@hugeicons/core-free-icons';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/severity-badge';
import { DEMO_SCAN } from '@/lib/scanner-data';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

const STATS = [
  { value: '120K+', label: 'Contracts scanned' },
  { value: '38', label: 'Detection rules' },
  { value: '$2.4B', label: 'Value protected' },
  { value: '< 8s', label: 'Average scan time' },
];

export function Stats() {
  return (
    <section className='border-y border-border bg-card/40'>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4'>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className='px-4 py-8 text-center'
          >
            <div className='text-2xl font-bold tracking-tight sm:text-3xl'>
              {s.value}
            </div>
            <div className='mt-1 text-sm text-muted-foreground'>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: ShieldAlert,
    title: 'Vulnerability detection',
    desc: 'Reentrancy, access control, oracle manipulation, flash loan risks and 30+ more rules.',
  },
  {
    icon: ScanLine,
    title: 'Security scoring',
    desc: 'A clear 0–100 score with a risk level and category breakdown for every contract.',
  },
  {
    icon: BotIcon,
    title: 'AI audit assistant',
    desc: 'Ask questions in plain English and get step-by-step explanations and fixes.',
  },
  {
    icon: FileText,
    title: 'Audit reports',
    desc: 'Generate professional reports and export to PDF, Markdown or JSON instantly.',
  },
  {
    icon: GitCompareIcon,
    title: 'Comparison mode',
    desc: 'Diff two contract versions to see new vulnerabilities and score changes.',
  },
  {
    icon: LayersIcon,
    title: 'Developer mode',
    desc: 'Line-by-line markers highlight risky code directly in the Solidity viewer.',
  },
];

export function Features() {
  return (
    <section id='features' className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
      <motion.div {...fadeUp} className='mx-auto max-w-2xl text-center'>
        <h2 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
          Everything you need to ship secure contracts
        </h2>
        <p className='mt-4 text-pretty text-muted-foreground'>
          A complete security workflow, from automated detection to professional
          audit deliverables.
        </p>
      </motion.div>
      <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className='h-full p-6 transition-colors hover:border-primary/40'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <HugeiconsIcon icon={f.icon} size={20} strokeWidth={1.5} />
              </div>
              <h3 className='mt-4 font-semibold'>{f.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                {f.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: UploadIcon,
    title: 'Submit your contract',
    desc: 'Paste an address, upload a .sol file, or drop in your source code.',
  },
  {
    icon: Workflow,
    title: 'AI runs the analysis',
    desc: 'Static analysis and AI reasoning scan for known vulnerability patterns.',
  },
  {
    icon: FileText,
    title: 'Review & export',
    desc: 'Get a scored report with fixes and export it in your preferred format.',
  },
];

export function HowItWorks() {
  return (
    <section id='how' className='border-y border-border bg-card/40'>
      <div className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
        <motion.div {...fadeUp} className='mx-auto max-w-2xl text-center'>
          <h2 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
            How it works
          </h2>
          <p className='mt-4 text-muted-foreground'>
            Three steps from contract to audit-ready report.
          </p>
        </motion.div>
        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className='relative'
            >
              <Card className='h-full p-6'>
                <div className='flex items-center gap-3'>
                  <div className='flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold'>
                    {i + 1}
                  </div>
                  <HugeiconsIcon
                    icon={s.icon}
                    size={20}
                    strokeWidth={1.5}
                    className='text-muted-foreground'
                  />
                </div>
                <h3 className='mt-4 font-semibold'>{s.title}</h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {s.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const NETWORKS = ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum', 'Base'];

export function Networks() {
  return (
    <section id='networks' className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
      <motion.div {...fadeUp} className='mx-auto max-w-2xl text-center'>
        <h2 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
          Supported blockchains
        </h2>
        <p className='mt-4 text-muted-foreground'>
          Scan verified contracts across every major EVM network.
        </p>
      </motion.div>
      <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
        {NETWORKS.map((n, i) => (
          <motion.div
            key={n}
            {...fadeUp}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className='rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium'
          >
            {n}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ExampleFindings() {
  return (
    <section id='findings' className='border-y border-border bg-card/40'>
      <div className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
        <motion.div {...fadeUp} className='mx-auto max-w-2xl text-center'>
          <h2 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
            Example vulnerability findings
          </h2>
          <p className='mt-4 text-muted-foreground'>
            This is the kind of detail you get for every issue detected.
          </p>
        </motion.div>
        <div className='mx-auto mt-10 grid max-w-3xl gap-4'>
          {DEMO_SCAN.vulnerabilities.slice(0, 3).map((v, i) => (
            <motion.div
              key={v.id}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Card className='p-5'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold'>{v.title}</h3>
                      <SeverityBadge severity={v.severity} />
                    </div>
                    <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                      {v.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCTA() {
  return (
    <section className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
      <motion.div {...fadeUp}>
        <Card className='relative overflow-hidden p-10 text-center sm:p-14'>
          <div
            className='pointer-events-none absolute inset-0 -z-10 opacity-50'
            style={{
              background:
                'radial-gradient(50% 80% at 50% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent)',
            }}
            aria-hidden
          />
          <h2 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
            Scan your first contract for free
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-pretty text-muted-foreground'>
            No wallet connection required. Get a full security report in
            seconds.
          </p>
          <div className='mt-8 flex justify-center'>
            <Button size='lg'>
              <Link href='/dashboard'>
                Launch the scanner
                <HugeiconsIcon
                  icon={ArrowRightIcon}
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className='border-t border-border'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6'>
        <Logo />
        <p className='text-sm text-muted-foreground'>
          © 2026 SentinelChain. For educational and demonstration purposes.
        </p>
        <div className='flex gap-6 text-sm text-muted-foreground'>
          <a href='#' className='hover:text-foreground'>
            Docs
          </a>
          <a href='#' className='hover:text-foreground'>
            Privacy
          </a>
          <a href='#' className='hover:text-foreground'>
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
