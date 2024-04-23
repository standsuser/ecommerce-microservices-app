import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
  async register(user: User): Promise<User> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    user.verified = false; // Set verified to false initially
    return this.userService.create(user);
  }

  async verifyEmail(token: string): Promise<void> {
    // Implement logic to verify email
  }
  

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    // Implement logic to send password reset email
  }
  
  

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
