import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(): Promise<{ token: string }> {
    try {
      // Call the authenticate method from the AuthService
      const token = await this.authService.authenticate();
      return { token };
    } catch (error) {
      console.error('Error during authentication:', error);
      throw new Error('Failed to authenticate');
    }
  }
}
