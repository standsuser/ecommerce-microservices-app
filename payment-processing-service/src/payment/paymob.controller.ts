// payment.controller.ts

import { Controller, Post, Body, Res, Redirect } from '@nestjs/common';
import { PaymobService } from './paymob.service';
import { AuthService } from '../auth/auth.service'; // Adjust the import path

@Controller('payment')
export class PaymobController {
  constructor(
    private readonly paymobService: PaymobService,
    private readonly authService: AuthService, // Inject the AuthService
  ) {} 

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
  @Post('payment/key')
  @Redirect() // Using the Redirect decorator
  async getPaymentKeyAndRedirect(@Body() paymentData: any): Promise<{ url: string }> {
    try {
      const paymentKey = await this.paymobService.getPaymentKey(paymentData);
      const iframeId = '844345'; // Your iframe ID
      const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
      
      // Return the URL to redirect to
      return { url: iframeUrl };
    } catch (error) {
      // Handle errors here
      console.error('Error in getPaymentKeyAndRedirect:', error);
      throw new Error('Failed to redirect to payment iframe');
    }
  }
}
