// payment.controller.ts

import { Controller, Post, Body, Res, Redirect, Param } from '@nestjs/common';
import { PaymobService } from './paymob.service';
import { AuthService } from '../auth/auth.service'; // Adjust the import path

@Controller('payment')
export class PaymobController {
  constructor(
    private readonly paymobService: PaymobService,
    private readonly authService: AuthService, // Inject the AuthService
  ) { }

  @Post('register-order')
  async registerOrder(@Body() orderData: any): Promise<{ orderId: number }> {
    try {
      const orderId = await this.paymobService.registerOrder(orderData);
      return { orderId };
    } catch (error) {
      console.error('Error registering order:', error);
      throw new Error('Failed to register order');
    }
  }
  @Post('order-payment/:orderId')
  @Redirect()
  async getPaymentKeyAndRedirect(@Param('orderId') orderId: string, @Body() paymentData: any): Promise<any/* { url: string } */> {
    try {
      const paymentKey = await this.paymobService.getPaymentKey(paymentData, orderId);
      // const iframeId = '844345'; // Your iframe ID
      // const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

      // Return the URL to redirect to
      // return { url: iframeUrl };
      return paymentKey;
    } catch (error) {
      // Handle errors here
      console.error('Error in getPaymentKeyAndRedirect:', error);
      throw new Error('Failed to redirect to payment iframe');
    }
  }
}
