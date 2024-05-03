/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get , Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/role.decorator';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Roles('admin', 'moderator')
  @Get('private-access')
  getAccessToSourcesWhichOnlyAdminModeratorCanAccess(): string {
    return this.appService.getHello();
  }

  

}
