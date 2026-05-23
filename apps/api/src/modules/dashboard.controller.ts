import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { AppService } from './app.service.js';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly appService: AppService) {}

  @Get('summary')
  summary(@CurrentUser() user: { schoolId: string }) {
    return this.appService.dashboardSummary(user.schoolId);
  }
}
