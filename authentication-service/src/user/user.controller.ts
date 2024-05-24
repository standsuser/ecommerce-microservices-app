import { Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthGuard } from '../strategies/local-auth.guard';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { ExistsAuthGuard } from '../strategies/exists-auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(ExistsAuthGuard)
  @MessagePattern('register')
  async register(command) {
    return this.userService.register(command.data);
  }

  @MessagePattern('forgetPassword')
  async forgetPassword(command) {
    return this.userService.forgetPassword(command.email, command.newPassword, command.otp);
  }

  @MessagePattern('sendPasswordResetEmail')
  async sendPasswordResetEmail(command) {
    return this.userService.sendPasswordResetEmail(command.email);
  }

  @UseGuards(LocalAuthGuard)
  @MessagePattern('login')
  async login(command) {
    const { email, password } = command.user;
    console.log('command user: ', command.user);
    return this.userService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('me')
  async me(command) {
    const { id, ...rest } = command.user;
    return rest;
  }

//   @MessagePattern('isAutheticated')
//   async isAutheticated(command) {
//     try {
//       return this.userService.validateToken(command.jwt);
//     } catch (err) {
//       return false;
//     }
//   }

  @MessagePattern('getUserbyID')
  async getUserbyID(command) {
    return this.userService.getUserbyID(command.userID);
  }

  @MessagePattern('updatePassword')
  async updatePassword(command) {
    return this.userService.updatePassword(command.email, command.password);
  }






}
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserbyID(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        Logger.error("Error fetching user:", error);
        throw new InternalServerErrorException("Failed to fetch user");
      }
    }
  }
}

