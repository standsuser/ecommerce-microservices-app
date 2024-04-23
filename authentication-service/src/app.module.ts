import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs-auth'),
    AuthModule,
  ],
  controllers: [UserController ],
  providers: [UserService],
})
export class AppModule {}
