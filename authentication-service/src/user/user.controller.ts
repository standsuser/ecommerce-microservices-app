
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';





@UseGuards(LocalAuthGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    const userId = req.user.sub;
    return this.userService.findById(userId);
  }
}
