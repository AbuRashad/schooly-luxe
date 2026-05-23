import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service.js';
import { HealthController } from './health.controller.js';
import { AuthController } from './auth.controller.js';
import { SchoolController } from './school.controller.js';
import { StudentController } from './student.controller.js';
import { AttendanceController } from './attendance.controller.js';
import { AssetController } from './asset.controller.js';
import { DashboardController } from './dashboard.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'schooly-luxe-super-secret-change-me',
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [HealthController, AuthController, SchoolController, StudentController, AttendanceController, AssetController, DashboardController],
  providers: [PrismaService, AppService]
})
export class AppModule {}
