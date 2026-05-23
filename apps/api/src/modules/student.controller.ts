import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { AppService } from './app.service.js';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly appService: AppService) {}

  @Get()
  list(@CurrentUser() user: { schoolId: string }) {
    return this.appService.students(user.schoolId);
  }

  @Post()
  create(@CurrentUser() user: { schoolId: string }, @Body() body: unknown) {
    return this.appService.createStudent(user.schoolId, body);
  }
}
