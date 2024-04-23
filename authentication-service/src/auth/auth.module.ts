import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthGuard } from './local-auth.guard';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
    PassportModule,
    JwtModule.register({
        secret: 'zoz12345678',
        signOptions: { expiresIn: '1h' },
      }),
  ],
  providers: [AuthService, UserService ,LocalAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
