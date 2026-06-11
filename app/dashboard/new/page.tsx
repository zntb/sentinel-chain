'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FileCode,
  Loading02Icon,
  Sparkles,
  Upload,
  X,
  Zap,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/dashboard-topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { DEMO_CONTRACT_CODE, NETWORKS } from '@/lib/scanner-data';

const schema = z.object({
  address: z
    .string()
    .optional()
    .refine(v => !v || /^0x[a-fA-F0-9]{40}$/.test(v), {
      message: 'Enter a valid 0x address (40 hex characters).',
    }),
  network: z.string(),
});

type FormValues = z.infer<typeof schema>;

const SCAN_STAGES = [
  'Fetching contract source...',
  'Parsing Solidity AST...',
  'Running 38 detection rules...',
  'Scoring and ranking findings...',
  'Generating audit summary...',
];

export default function NewScanPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [stage, setStage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { network: 'Ethereum', address: '' },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const network = watch('network');

  const readFile = useCallback((file: File) => {
    if (!file.name.endsWith('.sol')) {
      toast.error('Invalid file type', {
        description: 'Please upload a Solidity (.sol) file.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCode(String(reader.result ?? ''));
      setFileName(file.name);
      toast.success('File loaded', { description: file.name });
    };
    reader.readAsText(file);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  function runScan() {
    setScanning(true);
    setStage(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i < SCAN_STAGES.length) {
        setStage(i);
      } else {
        clearInterval(interval);
        router.push('/dashboard/scan/scan-demo');
      }
    }, 600);
  }

  function onSubmit(values: FormValues) {
    if (!values.address && !code.trim()) {
      toast.error('Nothing to scan', {
        description:
          'Provide a contract address or paste Solidity source code.',
      });
      return;
    }
    runScan();
  }

  function loadDemo() {
    setCode(DEMO_CONTRACT_CODE);
    setFileName('VulnerableVault.sol');
    toast.info('Demo contract loaded', {
      description: 'A deliberately vulnerable vault, ready to scan.',
    });
  }

  if (scanning) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center'>
        <div className='relative flex size-20 items-center justify-center'>
          <span className='absolute inset-0 animate-ping rounded-full bg-primary/20' />
          <div className='flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary'>
            <HugeiconsIcon
              icon={Loading02Icon}
              className='size-7 animate-spin'
            />
          </div>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Analyzing contract</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {SCAN_STAGES[stage]}
          </p>
        </div>
        <div className='flex w-full max-w-xs flex-col gap-2'>
          {SCAN_STAGES.map((s, i) => (
            <div
              key={s}
              className={cn(
                'flex items-center gap-2 text-left text-xs transition-colors',
                i <= stage ? 'text-foreground' : 'text-muted-foreground/50',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  i < stage
                    ? 'bg-primary'
                    : i === stage
                    ? 'bg-primary animate-pulse'
                    : 'bg-muted-foreground/30',
                )}
              />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <PageHeader
        title='New scan'
        description='Analyze a Solidity smart contract for security vulnerabilities.'
      >
        <Button type='button' variant='outline' onClick={loadDemo}>
          <HugeiconsIcon icon={Sparkles} className='size-4' />
          Try demo contract
        </Button>
      </PageHeader>

      <div className='grid gap-6 lg:grid-cols-5'>
        <Card className='p-6 lg:col-span-2'>
          <h2 className='font-semibold'>Contract details</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Scan a deployed contract by address.
          </p>
          <div className='mt-5 flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='network'>Network</Label>
              <Select
                value={network}
                onValueChange={v => setValue('network', v || 'Ethereum')}
              >
                <SelectTrigger id='network'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map(n => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='address'>Contract address</Label>
              <Input
                id='address'
                placeholder='0x0000...0000'
                className='font-mono'
                {...register('address')}
              />
              {errors.address && (
                <p className='text-xs text-destructive'>
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className='p-6 lg:col-span-3'>
          <h2 className='font-semibold'>Solidity source</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Upload a file or paste code directly.
          </p>
          <Tabs defaultValue='upload' className='mt-5'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='upload'>Upload</TabsTrigger>
              <TabsTrigger value='paste'>Paste code</TabsTrigger>
            </TabsList>
            <TabsContent value='upload' className='mt-4'>
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors',
                  dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/40',
                )}
              >
                <div className='flex size-11 items-center justify-center rounded-full bg-muted'>
                  <HugeiconsIcon
                    icon={Upload}
                    className='size-5 text-muted-foreground'
                  />
                </div>
                <p className='text-sm font-medium'>
                  Drop your .sol file here or click to browse
                </p>
                <p className='text-xs text-muted-foreground'>
                  Solidity files only, up to 1MB
                </p>
                <input
                  ref={inputRef}
                  type='file'
                  accept='.sol'
                  className='hidden'
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) readFile(f);
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value='paste' className='mt-4'>
              <Textarea
                value={code}
                onChange={e => {
                  setCode(e.target.value);
                  setFileName(null);
                }}
                placeholder='// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract { ... }'
                className='min-h-[200px] font-mono text-xs'
              />
            </TabsContent>
          </Tabs>

          {code && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className='mt-4 overflow-hidden rounded-lg border border-border'
            >
              <div className='flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2'>
                <div className='flex items-center gap-2 text-xs font-medium'>
                  <HugeiconsIcon
                    icon={FileCode}
                    className='size-4 text-primary'
                  />
                  {fileName ?? 'pasted-source.sol'}
                  <span className='text-muted-foreground'>
                    · {code.split('\n').length} lines
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setCode('');
                    setFileName(null);
                  }}
                  className='text-muted-foreground hover:text-foreground'
                  aria-label='Clear code'
                >
                  <HugeiconsIcon icon={X} className='size-4' />
                </button>
              </div>
              <pre className='max-h-48 overflow-auto bg-card p-3 text-xs leading-relaxed'>
                <code className='font-mono'>{code}</code>
              </pre>
            </motion.div>
          )}
        </Card>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' size='lg'>
          <HugeiconsIcon icon={Zap} className='size-4' />
          Analyze contract
        </Button>
      </div>
    </form>
  );
}
