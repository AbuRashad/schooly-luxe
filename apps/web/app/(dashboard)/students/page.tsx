'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Input } from '@schooly-luxe/ui';
import { apiRequest } from '@/components/api';
import { getToken } from '@/components/auth';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  className: string;
  admissionNo: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', admissionNo: '', className: '' });

  async function load() {
    const token = getToken();
    if (!token) return;
    const data = await apiRequest('/students', {}, token);
    setStudents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createStudent(event: FormEvent) {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    await apiRequest(
      '/students',
      {
        method: 'POST',
        body: JSON.stringify(form)
      },
      token
    );

    setForm({ firstName: '', lastName: '', admissionNo: '', className: '' });
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Students</h2>
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
              <p className="font-medium">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-slate-400">{student.className} · {student.admissionNo}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add student</h2>
        <form className="space-y-3" onSubmit={createStudent}>
          <Input placeholder="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
          <Input placeholder="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
          <Input placeholder="Admission number" value={form.admissionNo} onChange={(event) => setForm({ ...form, admissionNo: event.target.value })} />
          <Input placeholder="Class" value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })} />
          <Button type="submit" className="w-full">Create student</Button>
        </form>
      </Card>
    </div>
  );
}
