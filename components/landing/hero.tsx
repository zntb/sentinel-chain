'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRightIcon,
  Loading02Icon,
  SearchIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HeroBadge } from './landing-nav';

export function Hero() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  function handleScan() {
    setLoading(true);
    setTimeout(() => router.push('/dashboard/scan/scan-demo'), 700);
  }

  return (
    <section className='relative overflow-hidden'>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] opacity-60'
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--primary) 22%, transparent), transparent)',
        }}
        aria-hidden
      />
      <div className='mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28'>
        <div className='flex justify-center'>
          <HeroBadge />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className='mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl'
        >
          Find smart contract vulnerabilities before they become exploits
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className='mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'
        >
          AI-powered Solidity security analysis and automated audit reports.
          Scan any contract address or paste your source code to get a full risk
          breakdown in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className='mx-auto mt-8 max-w-xl'
        >
          <div className='flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:flex-row sm:items-center'>
            <div className='flex flex-1 items-center gap-2 px-2'>
              <HugeiconsIcon
                icon={SearchIcon}
                className='size-4 shrink-0 text-muted-foreground'
              />
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder='0x... contract address'
                className='border-0 bg-transparent font-mono text-sm shadow-none focus-visible:ring-0'
              />
            </div>
            <Button
              onClick={handleScan}
              disabled={loading}
              className='sm:w-auto'
            >
              {loading ? (
                <HugeiconsIcon
                  icon={Loading02Icon}
                  className='size-4 animate-spin'
                />
              ) : (
                <HugeiconsIcon icon={ZapIcon} className='size-4' />
              )}
              Analyze contract
            </Button>
          </div>
          <button
            onClick={handleScan}
            className='mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline'
          >
            Or try the demo vulnerable contract
            <HugeiconsIcon icon={ArrowRightIcon} className='size-3.5' />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
