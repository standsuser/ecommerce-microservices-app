import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
