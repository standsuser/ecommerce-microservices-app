// payment.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PaymobService } from './paymob.service';
import { AuthService } from '../auth/auth.service'; // Adjust the import path

@Controller('payment')
export class PaymobController {
  constructor(
    private readonly paymobService: PaymobService,
    private readonly authService: AuthService, // Inject the AuthService
  ) {}


  @Post('register-order')
  async registerOrder(@Body() auth:string, orderData: any): Promise<{ orderId: number }> {
    try {
      const orderId = await this.paymobService.registerOrder(auth, orderData);
      return { orderId };
    } catch (error) {
      console.error('Error registering order:', error);
      throw new Error('Failed to register order');
    }
  }
  @Post('get-payment-key')
  async getPaymentKey(@Body()  paymentData: any): Promise<{ token: string }> {
    try {
      const token = await this.paymobService.getPaymentKey(paymentData);
      return { token };
    } catch (error) {
      console.error('Error obtaining payment key:', error);
      throw new Error('Failed to obtain payment key');
    }
  }
}
