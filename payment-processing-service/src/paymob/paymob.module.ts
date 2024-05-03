// paymob.module.ts

import { Module } from '@nestjs/common';
import { PaymobService } from './paymob.service';

@Module({
  providers: [PaymobService],
  exports: [PaymobService],
})
export class PaymobModule {}
