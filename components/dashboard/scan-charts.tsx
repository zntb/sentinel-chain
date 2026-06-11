'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import type { ScanResult } from '@/lib/scanner-data';

const SEV_COLORS: Record<string, string> = {
  Critical: 'var(--critical)',
  High: 'var(--high)',
  Medium: 'var(--medium)',
  Low: 'var(--low)',
};

export function SeverityChart({ scan }: { scan: ScanResult }) {
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const v of scan.vulnerabilities) {
    if (v.severity === 'critical') counts.Critical += 1;
    else if (v.severity === 'high') counts.High += 1;
    else if (v.severity === 'medium') counts.Medium += 1;
    else counts.Low += 1;
  }
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width='100%' height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke='var(--border)' />
        <XAxis
          dataKey='name'
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <Bar dataKey='value' radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map(d => (
            <Cell key={d.name} fill={SEV_COLORS[d.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryRadar({ scan }: { scan: ScanResult }) {
  return (
    <ResponsiveContainer width='100%' height={240}>
      <RadarChart data={scan.breakdown} outerRadius='72%'>
        <PolarGrid stroke='var(--border)' />
        <PolarAngleAxis
          dataKey='label'
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <Radar
          dataKey='score'
          stroke='var(--primary)'
          fill='var(--primary)'
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
