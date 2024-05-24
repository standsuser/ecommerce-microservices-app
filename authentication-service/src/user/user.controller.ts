import { Body, Controller, Get, Patch, InternalServerErrorException, Logger, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthGuard } from '../strategies/local-auth.guard';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { ExistsAuthGuard } from '../strategies/exists-auth.guard';

export interface User extends Document {
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  company?: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  postal_code?: string;
  extra_description?: string;
  city?: string;
  country?: string;
  addresslabel?: string;
  state?: string;
  password: string;
}

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

  @Patch('/editProfile/:userId')
  async editProfile(@Param('userId') userId: string, @Body() body: any) {
    return await this.userService.editProfile(userId, body);
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

  @MessagePattern('confirmOtp')
  async confirmOtp(command) {
    return this.userService.confirmOtp(command.email, command.otp);
  }

  @MessagePattern('resendOtp')
  async resendOtp(command) {
    return this.userService.resendOtp(command.email);
  }




  @Put('update/:id')
  async updateUserProfile(@Param('id') userId: string, @Body() updateData: Partial<User>) {
    try {
      const updatedUser = await this.userService.updateUserProfile(userId, updateData);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        Logger.error("Error updating user profile:", error);
        throw new InternalServerErrorException("Failed to update user profile");
      }
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



