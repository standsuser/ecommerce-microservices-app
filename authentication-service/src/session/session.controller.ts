import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern('createSession')
  async createSession(command) {
    return this.sessionService.createSession(command.userID, command.access_token);
  }

  @MessagePattern('deleteSession')
  async deleteSession(command) {
    return this.sessionService.deleteSession(command.userID);
  }
  
  @MessagePattern('validateSession')
  async validateSession(command) {
    return this.sessionService.validateSession(command.email);
  }

  @MessagePattern('createGuestSession')
  async createGuestSession(command){
    return this.sessionService.createGuestSession();

  }

  @MessagePattern('updateSession')
  async updateSession(command){
    return this.sessionService.updateSession(command.userID, command.guestID , command.access_token);
  }



}