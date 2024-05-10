/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/role.decorator';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create.user.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Roles('admin', 'moderator')
  @Get('private-access')
  getAccessToSourcesWhichOnlyAdminModeratorCanAccess(): string {
    return this.appService.getHello();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      // Basic validation to ensure required fields are provided
      if (!createUserDto.email || !createUserDto.password) {
        throw new BadRequestException('email and password are required');
      }

      // Check if additional required fields are provided
      if (!createUserDto.firstname || !createUserDto.lastname || !createUserDto.email || !createUserDto.phonenumber || !createUserDto.address) {
        throw new BadRequestException('First name, last name, email, phone number, and address are required');
      }

      // Register user using the provided DTO
      const newUser = await this.userService.register(createUserDto);

      // Return successful response
      return { success: true, data: newUser };
    } catch (error) {
      // Handle any errors thrown during registration
      return { success: false, message: error.message || 'An error occurred during registration' };
    }
  }

  @Post('login')
  async login(@Body() user: any): Promise<any> {
    try {
      // Attempt to login user
      const response = await this.userService.login(user);
      return { success: true, response };
      // Return response
    } catch (error) {
      // Handle any errors thrown during login
      return { success: false, message: error }; // Return error response
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }): Promise<any> {
    try {
      // Attempt to send password reset email
      const response = await this.userService.forgetPassword(email);
      return { success: true, response };
    } catch (error) {
      // Handle any errors thrown during password reset
      return { success: false, message: error }; // Return error response
    }
  }
  




}
