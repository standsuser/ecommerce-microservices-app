import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '../user/user'; // Assuming the User model is located in the user folder and the file is named user.model.ts

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string): Promise<void> {
    return this.authService.verifyEmail(token);
  }

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    return this.authService.register(user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    return this.authService.sendPasswordResetEmail(email);
  }
}
