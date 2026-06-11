'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Download, FileText, Loader } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatDate, type ScanResult } from '@/lib/scanner-data';

function buildMarkdown(scan: ScanResult): string {
  const lines = [
    `# Security Audit Report: ${scan.contractName}`,
    '',
    '## Executive Summary',
    `This report covers an automated security analysis of \`${scan.contractName}\` deployed at \`${scan.address}\` on ${scan.network}. The contract received a security score of **${scan.securityScore}/100** (${scan.riskLevel}), with ${scan.totalVulnerabilities} findings including ${scan.criticalIssues} critical issue(s).`,
    '',
    '## Contract Information',
    `- **Name:** ${scan.contractName}`,
    `- **Address:** ${scan.address}`,
    `- **Network:** ${scan.network}`,
    `- **Scanned:** ${formatDate(scan.scannedAt)}`,
    `- **Verified:** ${scan.verified ? 'Yes' : 'No'}`,
    '',
    '## Security Score',
    `- **Score:** ${scan.securityScore}/100`,
    `- **Risk level:** ${scan.riskLevel}`,
    `- **Complexity:** ${scan.complexity}/100`,
    '',
    '## Vulnerabilities',
  ];
  for (const v of scan.vulnerabilities) {
    lines.push(
      '',
      `### ${v.title} (${v.severity.toUpperCase()})`,
      `- **Category:** ${v.category}`,
      `- **Location:** ${v.affectedLines}`,
      '',
      v.description,
      '',
      '**Affected code:**',
      '```solidity',
      v.affectedCode,
      '```',
      '',
      `**Risk:** ${v.riskExplanation}`,
      '',
      `**Recommendation:** ${v.recommendation}`,
    );
  }
  lines.push(
    '',
    '## Risk Assessment',
    `The contract is rated **${scan.riskLevel}**. Address all critical and high-severity findings before deployment.`,
  );
  return lines.join('\n');
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const FORMATS = [
  {
    id: 'pdf',
    label: 'PDF document',
    desc: 'Printable, formatted audit report',
    icon: FileText,
  },
  {
    id: 'md',
    label: 'Markdown',
    desc: 'Developer-friendly .md file',
    icon: FileText,
  },
  {
    id: 'json',
    label: 'JSON',
    desc: 'Machine-readable structured data',
    icon: FileText,
  },
] as const;

export function ReportGenerator({
  scan,
  trigger,
}: {
  scan: ScanResult;
  trigger?: React.ReactNode;
}) {
  const [format, setFormat] = useState<'pdf' | 'md' | 'json'>('pdf');
  const [generating, setGenerating] = useState(false);

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      const base = `${scan.contractName}-audit`;
      if (format === 'md') {
        download(`${base}.md`, buildMarkdown(scan), 'text/markdown');
      } else if (format === 'json') {
        download(
          `${base}.json`,
          JSON.stringify(scan, null, 2),
          'application/json',
        );
      } else {
        // PDF path: open a print-ready window with the report HTML
        const md = buildMarkdown(scan);
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(
            `<html><head><title>${base}</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.6;color:#111} pre{background:#f4f4f5;padding:12px;border-radius:8px;overflow:auto;font-size:12px} code{font-family:ui-monospace,monospace}</style></head><body><pre style="white-space:pre-wrap;background:none;padding:0">${md
              .replace(/&/g, '&amp;')
              .replace(
                /</g,
                '&lt;',
              )}</pre><script>window.onload=()=>window.print()</script></body></html>`,
          );
          win.document.close();
        }
      }
      setGenerating(false);
      toast.success('Report generated', {
        description: `${
          scan.contractName
        } exported as ${format.toUpperCase()}.`,
      });
    }, 900);
  }

  return (
    <Dialog>
      <DialogTrigger>
        {trigger ?? (
          <div className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-2.5'>
            <HugeiconsIcon icon={FileText} className='size-4' />
            Generate audit report
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate audit report</DialogTitle>
          <DialogDescription>
            Export a professional report for {scan.contractName}.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 py-2'>
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                format === f.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/40',
              )}
            >
              <div className='flex size-9 items-center justify-center rounded-lg bg-muted'>
                <HugeiconsIcon icon={f.icon} className='size-4' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>{f.label}</p>
                <p className='text-xs text-muted-foreground'>{f.desc}</p>
              </div>
              {format === f.id && (
                <HugeiconsIcon icon={Check} className='size-4 text-primary' />
              )}
            </button>
          ))}
        </div>
        <Button onClick={generate} disabled={generating} className='w-full'>
          {generating ? (
            <HugeiconsIcon icon={Loader} className='size-4 animate-spin' />
          ) : (
            <HugeiconsIcon icon={Download} className='size-4' />
          )}
          Export {format.toUpperCase()}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
