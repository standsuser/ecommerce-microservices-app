import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string, password: string, apiKey: string }): Promise<{ token: string }> {
    try {
      const { username, password, apiKey } = body;
      const token = await this.authService.authenticate(username, password, apiKey);
      return { token };
    } catch (error) {
      console.error('Error during authentication:', error);
      throw new Error('Failed to authenticate');
    }
  }
}