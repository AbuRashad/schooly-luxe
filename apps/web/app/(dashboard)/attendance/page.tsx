'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Input } from '@schooly-luxe/ui';
import { apiRequest } from '@/components/api';
import { getToken } from '@/components/auth';

type Attendance = {
  id: string;
  status: string;
  date: string;
  student: { firstName: string; lastName: string };
};

type Student = { id: string; firstName: string; lastName: string };

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ studentId: '', status: 'PRESENT', date: '' });

  async function load() {
    const token = getToken();
    if (!token) return;

    const [attendanceData, studentsData] = await Promise.all([
      apiRequest('/attendance', {}, token),
      apiRequest('/students', {}, token)
    ]);

    setRecords(attendanceData);
    setStudents(studentsData);
    if (!form.studentId && studentsData[0]) {
      setForm((current) => ({ ...current, studentId: studentsData[0].id }));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createRecord(event: FormEvent) {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    await apiRequest(
      '/attendance',
      {
        method: 'POST',
        body: JSON.stringify({ ...form, date: form.date ? new Date(form.date).toISOString() : undefined })
      },
      token
    );

    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Attendance log</h2>
        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
              <p className="font-medium">{record.student.firstName} {record.student.lastName}</p>
              <p className="text-sm text-slate-400">{record.status} · {new Date(record.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Mark attendance</h2>
        <form className="space-y-3" onSubmit={createRecord}>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm"
            value={form.studentId}
            onChange={(event) => setForm({ ...form, studentId: event.target.value })}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="LATE">LATE</option>
          </select>

          <Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          <Button type="submit" className="w-full">Save attendance</Button>
        </form>
      </Card>
    </div>
  );
}
