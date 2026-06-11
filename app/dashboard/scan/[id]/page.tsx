import { notFound } from 'next/navigation';
import { ScanReport } from '@/components/dashboard/scan-report';
import { getScanById } from '@/lib/scanner-data';

export default async function ScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = getScanById(id);
  if (!scan) notFound();
  return <ScanReport scan={scan} />;
}
