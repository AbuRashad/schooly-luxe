import bcrypt from 'bcryptjs';
import { PrismaClient, AttendanceStatus, AssetStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@schoolyluxe.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const school = await prisma.school.upsert({
    where: { code: 'SLX-HQ' },
    update: {},
    create: {
      name: 'Schooly Luxe International Academy',
      code: 'SLX-HQ',
      address: '14 Emerald Heights, Victoria Island'
    }
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Platform Admin', role: Role.ADMIN, schoolId: school.id },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Platform Admin',
      role: Role.ADMIN,
      schoolId: school.id
    }
  });

  const students = [
    { firstName: 'Amina', lastName: 'Rashid', admissionNo: 'SLX-001', className: 'JSS 1' },
    { firstName: 'Daniel', lastName: 'Okoro', admissionNo: 'SLX-002', className: 'JSS 2' },
    { firstName: 'Lina', lastName: 'Farouk', admissionNo: 'SLX-003', className: 'SS 1' }
  ];

  for (const student of students) {
    await prisma.student.upsert({
      where: { admissionNo: student.admissionNo },
      update: { ...student, schoolId: school.id },
      create: { ...student, schoolId: school.id }
    });
  }

  const studentRows = await prisma.student.findMany({ where: { schoolId: school.id } });
  const today = new Date();

  for (const [index, student] of studentRows.entries()) {
    await prisma.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: student.id,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        }
      },
      update: {},
      create: {
        studentId: student.id,
        schoolId: school.id,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        status: index === 1 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        note: index === 1 ? 'Arrived after morning briefing' : null
      }
    });
  }

  const assets = [
    { name: 'Computer Lab Workstation 01', category: 'Computer', serialNumber: 'ICT-LAB-001', status: AssetStatus.ACTIVE },
    { name: 'Projector - Hall A', category: 'Projector', serialNumber: 'ICT-PROJ-002', status: AssetStatus.MAINTENANCE },
    { name: 'Network Switch Core', category: 'Networking', serialNumber: 'ICT-NET-003', status: AssetStatus.ACTIVE }
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { serialNumber: asset.serialNumber },
      update: { ...asset, schoolId: school.id },
      create: {
        ...asset,
        schoolId: school.id,
        purchaseDate: new Date('2025-01-15')
      }
    });
  }

  const tuitionInvoice = await prisma.invoice.upsert({
    where: { id: 'seed-invoice-1' },
    update: {},
    create: {
      id: 'seed-invoice-1',
      title: 'Term 1 Tuition Batch',
      amount: 120000,
      dueDate: new Date('2026-06-15'),
      schoolId: school.id,
      payments: {
        create: [{ amount: 45000 }]
      }
    }
  });

  if (tuitionInvoice) {
    console.log('Seeded Schooly Luxe MVP data successfully.');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
