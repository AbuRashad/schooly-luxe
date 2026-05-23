import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(@Body() body: unknown) {
    return this.appService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { sub: string }) {
    return this.appService.me(user.sub);
  }
}
