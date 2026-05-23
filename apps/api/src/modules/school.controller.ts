import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { AppService } from './app.service.js';

@UseGuards(JwtAuthGuard)
@Controller('schools')
export class SchoolController {
  constructor(private readonly appService: AppService) {}

  @Get()
  schools() {
    return this.appService.schools();
  }
}
