'use client';

import { useEffect, useState } from 'react';
import { Card } from '@schooly-luxe/ui';
import type { DashboardSummary } from '@schooly-luxe/types';
import { apiRequest } from '@/components/api';
import { getToken } from '@/components/auth';

const labels: Array<[keyof DashboardSummary, string]> = [
  ['studentsCount', 'Total Students'],
  ['attendanceToday', 'Attendance Records (Today)'],
  ['presentToday', 'Present (Today)'],
  ['assetsCount', 'ICT Assets'],
  ['activeAssets', 'Active Assets'],
  ['invoicesOutstanding', 'Outstanding Invoices'],
  ['revenueCollected', 'Revenue Collected']
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiRequest('/dashboard/summary', {}, token)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {labels.map(([key, label]) => (
        <Card key={key}>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary ? Number(summary[key]).toLocaleString() : '—'}</p>
        </Card>
      ))}
    </section>
  );
}
