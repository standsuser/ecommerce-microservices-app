/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { databaseProviders } from './database/database.providers';
import { userProvider } from './database/user.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExistsStrategy } from './strategies/exists.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'Mado451880',
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService,
    ...userProvider, ...databaseProviders,
    LocalStrategy, JwtStrategy, ExistsStrategy],
  exports: [...databaseProviders, UserService],// added User Servcie to exports
})
export class UserModule { }
