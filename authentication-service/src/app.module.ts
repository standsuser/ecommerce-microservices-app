/* eslint-disable prettier/prettier */
import { Module, Session } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { RolesGuard } from './guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { SessionModule } from './session/session.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27018/authentication'),
    UserModule,
    SessionModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 9092,

        },
      },
    ]),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesGuard,
    Reflector,
    {
      provide: 'APP_INTERCEPTORS',
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule { }
