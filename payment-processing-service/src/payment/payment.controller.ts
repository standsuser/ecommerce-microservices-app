import { Controller, Post, Get, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payment')
  async processPayment(@Body() paymentData: any): Promise<any> {
    try {
      const paymentResponse = await this.paymentService.processPayment(paymentData);
      // Handle successful payment response
      return { success: true, data: paymentResponse };
    } catch (error) {
      // Handle payment error
      return { success: false, error: error.message || 'Payment failed' };
    }
  }
}
