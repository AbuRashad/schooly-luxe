import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { AppService } from './app.service.js';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly appService: AppService) {}

  @Get()
  list(@CurrentUser() user: { schoolId: string }) {
    return this.appService.attendance(user.schoolId);
  }

  @Post()
  create(@CurrentUser() user: { schoolId: string }, @Body() body: unknown) {
    return this.appService.createAttendance(user.schoolId, body);
  }
}
