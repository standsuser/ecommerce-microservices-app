import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymobModule } from './payment/paymob.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PaymobModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
