import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RolesGuard } from './guards/roles.guard';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { AccountService } from './account/account.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs-auth'),
    UserModule,
    AccountModule, // Import AccountModule here
    ClientsModule.register([
      {
        name: 'ACC_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'account-consumer',
          }
        }
      }
    ]),
  ],
  controllers: [AppController ],
  providers: [AppService ,
    AppService,
    RolesGuard,
    Reflector,
    // Inject AccountService here if necessary
    AccountService,
    {
      provide: 'APP_INTERCEPTORS',
      useClass: ErrorInterceptor
    }
  ],
})
export class AppModule {}
