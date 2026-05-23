'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Card, Input } from '@schooly-luxe/ui';
import { apiRequest } from '@/components/api';
import { setToken } from '@/components/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@schoolyluxe.com');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError('Please provide a valid email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(parsed.data)
      });

      setToken(response.accessToken);
      router.push('/dashboard');
    } catch {
      setError('Login failed. Check credentials and API status.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_55%)] p-6">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Schooly Luxe</p>
          <h1 className="mt-2 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your premium school command center.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
