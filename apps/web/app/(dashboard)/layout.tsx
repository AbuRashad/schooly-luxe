'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/components/auth';
import { Shell } from '@/components/shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="p-6 text-sm text-slate-300">Loading Schooly Luxe...</div>;
  }

  return <Shell>{children}</Shell>;
}
