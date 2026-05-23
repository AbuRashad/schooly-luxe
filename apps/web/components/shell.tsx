'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from './auth';

const items = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/students', label: 'Students' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/assets', label: 'ICT Assets' }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_55%)]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 rounded-3xl border border-white/10 bg-slate-900/70 p-5 lg:block">
          <p className="mb-6 text-sm uppercase tracking-[0.3em] text-indigo-300">Schooly Luxe</p>
          <nav className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  pathname === item.href ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div>
              <h1 className="text-xl font-semibold">Premium School Operations</h1>
              <p className="text-sm text-slate-400">Elegant administration, finance, analytics, and ICT control.</p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
              onClick={() => {
                clearToken();
                router.push('/');
              }}
            >
              Sign out
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
