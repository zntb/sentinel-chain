'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScoreRing } from '@/components/score-ring';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search, ArrowUpRight } from '@hugeicons/core-free-icons';
import {
  SCAN_HISTORY,
  NETWORKS,
  formatDate,
  shortAddress,
  riskLevelColor,
  type Network,
} from '@/lib/scanner-data';

export default function HistoryPage() {
  const [query, setQuery] = useState('');
  const [network, setNetwork] = useState<Network | 'all'>('all');
  const [sort, setSort] = useState<'recent' | 'score-asc' | 'score-desc'>(
    'recent',
  );

  const rows = useMemo(() => {
    let data = [...SCAN_HISTORY];
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        s =>
          s.contractName.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q),
      );
    }
    if (network !== 'all') data = data.filter(s => s.network === network);
    if (sort === 'recent') {
      data.sort((a, b) => +new Date(b.scannedAt) - +new Date(a.scannedAt));
    } else if (sort === 'score-asc') {
      data.sort((a, b) => a.securityScore - b.securityScore);
    } else {
      data.sort((a, b) => b.securityScore - a.securityScore);
    }
    return data;
  }, [query, network, sort]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Scan History</h1>
        <p className='text-sm text-muted-foreground'>
          Every contract you&apos;ve analyzed, with filters and quick access to
          full reports.
        </p>
      </div>

      <Card>
        <CardHeader className='gap-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle className='text-base'>{rows.length} scans</CardTitle>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <div className='relative'>
                <HugeiconsIcon
                  icon={Search}
                  className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
                />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder='Search name or address'
                  className='pl-9 sm:w-64'
                />
              </div>
              <Select
                value={network}
                onValueChange={v => setNetwork(v as Network | 'all')}
              >
                <SelectTrigger className='sm:w-40'>
                  <SelectValue placeholder='Network' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All networks</SelectItem>
                  {NETWORKS.map(n => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sort}
                onValueChange={v => setSort(v as typeof sort)}
              >
                <SelectTrigger className='sm:w-40'>
                  <SelectValue placeholder='Sort' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='recent'>Most recent</SelectItem>
                  <SelectItem value='score-desc'>Highest score</SelectItem>
                  <SelectItem value='score-asc'>Lowest score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className='text-right'>Score</TableHead>
                  <TableHead className='w-10' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(s => (
                  <TableRow key={s.id} className='group'>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{s.contractName}</span>
                        <span className='font-mono text-xs text-muted-foreground'>
                          {shortAddress(s.address)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{s.network}</Badge>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {formatDate(s.scannedAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className='text-sm font-medium'
                        style={{ color: riskLevelColor(s.riskLevel) }}
                      >
                        {s.riskLevel}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end'>
                        <ScoreRing
                          score={s.securityScore}
                          size={40}
                          strokeWidth={4}
                          showLabel={false}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/dashboard/scan/${s.id}`}
                        className={
                          (buttonVariants({
                            variant: 'ghost',
                            size: 'icon',
                          }),
                          'opacity-60 transition group-hover:opacity-100')
                        }
                      >
                        aria-label={`Open ${s.contractName} report`}
                        <HugeiconsIcon icon={ArrowUpRight} className='size-4' />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='py-10 text-center text-sm text-muted-foreground'
                    >
                      No scans match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
