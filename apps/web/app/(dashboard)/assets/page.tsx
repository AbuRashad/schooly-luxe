'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Input } from '@schooly-luxe/ui';
import { apiRequest } from '@/components/api';
import { getToken } from '@/components/auth';

type Asset = {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: string;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState({ name: '', category: '', serialNumber: '', status: 'ACTIVE' });

  async function load() {
    const token = getToken();
    if (!token) return;
    setAssets(await apiRequest('/assets', {}, token));
  }

  useEffect(() => {
    load();
  }, []);

  async function createAsset(event: FormEvent) {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    await apiRequest(
      '/assets',
      {
        method: 'POST',
        body: JSON.stringify(form)
      },
      token
    );

    setForm({ name: '', category: '', serialNumber: '', status: 'ACTIVE' });
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">ICT Asset Registry</h2>
        <div className="space-y-2">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
              <p className="font-medium">{asset.name}</p>
              <p className="text-sm text-slate-400">{asset.category} · {asset.serialNumber} · {asset.status}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add ICT asset</h2>
        <form className="space-y-3" onSubmit={createAsset}>
          <Input placeholder="Asset name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          <Input placeholder="Serial number" value={form.serialNumber} onChange={(event) => setForm({ ...form, serialNumber: event.target.value })} />

          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="RETIRED">RETIRED</option>
          </select>

          <Button type="submit" className="w-full">Create asset</Button>
        </form>
      </Card>
    </div>
  );
}
