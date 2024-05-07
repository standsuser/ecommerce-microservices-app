import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymobController } from './paymob.controller';
import { PaymobService } from './paymob.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from'src/auth/auth.service';

@Module({
    imports: [ConfigModule.forRoot(), AuthModule],
    controllers: [PaymobController],
    providers: [PaymobService, ConfigService, AuthService],
})
export class PaymobModule {}

