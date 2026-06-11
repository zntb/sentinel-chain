'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRightIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Networks', href: '#networks' },
  { label: 'Findings', href: '#findings' },
];

export function LandingNav() {
  return (
    <header className='sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6'>
        <Link href='/'>
          <Logo />
        </Link>
        <nav className='hidden items-center gap-8 md:flex'>
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className='text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='hidden sm:inline-flex'>
            <Link href='/dashboard'>Sign in</Link>
          </Button>
          <Button size='sm'>
            <Link href='/dashboard'>
              Launch app
              <HugeiconsIcon icon={ArrowRightIcon} className='size-4' />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur'
    >
      <HugeiconsIcon icon={SparklesIcon} className='size-3.5 text-primary' />
      AI-powered Solidity security analysis
    </motion.div>
  );
}
