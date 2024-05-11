import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionModel } from './session.model';
import { sessionProvider } from '../database/session.providers';
import { UserService } from 'src/user/user.service';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  imports: [],
  controllers: [SessionController],
  providers: [SessionService , ...sessionProvider,...databaseProviders],
  exports: [SessionService,...databaseProviders],
})
export class SessionModule {}