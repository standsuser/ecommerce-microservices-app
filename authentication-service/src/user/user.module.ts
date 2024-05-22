/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { databaseProviders } from '../database/database.providers';
import { userProvider } from '../database/user.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ExistsStrategy } from '../strategies/exists.strategy';
import { sessionProvider } from 'src/database/session.providers';
import { SessionModule } from 'src/session/session.module';
import { SessionService } from 'src/session/session.service';
import { ProducerService } from 'src/kafka/producer.service';


@Module({
  imports: [
    PassportModule,
    SessionModule,
    JwtModule.register({
      secret: 'Mado451880',
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService,
    ...userProvider, ...databaseProviders,
    LocalStrategy, JwtStrategy, ExistsStrategy, ProducerService],
  exports: [...databaseProviders, UserService],// added User Servcie to exports
})
export class UserModule { }