import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AttendanceStatus, AssetStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaService } from '../common/prisma.service.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const studentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  admissionNo: z.string().min(1),
  className: z.string().min(1)
});

const attendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.string().datetime().optional(),
  status: z.nativeEnum(AttendanceStatus),
  note: z.string().max(200).optional()
});

const assetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  serialNumber: z.string().min(1),
  status: z.nativeEnum(AssetStatus).default(AssetStatus.ACTIVE)
});

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(payload: unknown) {
    const { email, password } = loginSchema.parse(payload);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId
      }
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, schoolId: true }
    });
  }

  async schools() {
    return this.prisma.school.findMany({
      orderBy: { createdAt: 'asc' }
    });
  }

  async students(schoolId: string) {
    return this.prisma.student.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
  }

  async createStudent(schoolId: string, payload: unknown) {
    const data = studentSchema.parse(payload);
    return this.prisma.student.create({ data: { ...data, schoolId } });
  }

  async attendance(schoolId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { schoolId },
      include: { student: true },
      orderBy: [{ date: 'desc' }, { recordedAt: 'desc' }]
    });
  }

  async createAttendance(schoolId: string, payload: unknown) {
    const parsed = attendanceSchema.parse(payload);
    return this.prisma.attendanceRecord.create({
      data: {
        studentId: parsed.studentId,
        schoolId,
        date: parsed.date ? new Date(parsed.date) : new Date(),
        status: parsed.status,
        note: parsed.note
      }
    });
  }

  async assets(schoolId: string) {
    return this.prisma.asset.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
  }

  async createAsset(schoolId: string, payload: unknown) {
    const data = assetSchema.parse(payload);
    return this.prisma.asset.create({ data: { ...data, schoolId } });
  }

  async dashboardSummary(schoolId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [studentsCount, attendanceToday, presentToday, assetsCount, activeAssets, invoices, payments] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.attendanceRecord.count({ where: { schoolId, date: { gte: todayStart } } }),
      this.prisma.attendanceRecord.count({ where: { schoolId, date: { gte: todayStart }, status: AttendanceStatus.PRESENT } }),
      this.prisma.asset.count({ where: { schoolId } }),
      this.prisma.asset.count({ where: { schoolId, status: AssetStatus.ACTIVE } }),
      this.prisma.invoice.findMany({ where: { schoolId }, select: { amount: true, payments: { select: { amount: true } } } }),
      this.prisma.payment.findMany({ where: { invoice: { schoolId } }, select: { amount: true } })
    ]);

    const invoicesOutstanding = invoices.reduce((acc, invoice) => {
      const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      return acc + Number(invoice.amount) - paid;
    }, 0);

    const revenueCollected = payments.reduce((acc, payment) => acc + Number(payment.amount), 0);

    return {
      studentsCount,
      attendanceToday,
      presentToday,
      assetsCount,
      activeAssets,
      invoicesOutstanding,
      revenueCollected
    };
  }
}
