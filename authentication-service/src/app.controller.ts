import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/role.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles('admin','moderator')
  @Get('private-access')
  getAccessToSourcesWhichOnlyAdminModeratorCanAccess(): string {
    return this.appService.getHello();
  }

  
}
