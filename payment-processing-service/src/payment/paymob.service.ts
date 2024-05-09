import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service'; 

@Injectable()
export class PaymobService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService, 
  ) {}

  async registerOrder(orderData: any): Promise<number> {
    const authToken = await this.authService.authenticate(); 

    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/ecommerce/orders',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Include the authentication token in the request header 
          },
        }
      );

      // Assuming response includes an order ID
      return response.data;
    } catch (error) {
      console.error('Error registering order:', error);
      throw new Error('Failed to register order');
    }
  }

  async getPaymentKey(paymentData: any): Promise<string> {
    const authToken = await this.authService.authenticate(); // Call authenticate method on injected instance

    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/acceptance/payment_keys',
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log('Paymob API Response:', response.data);

      return response?.data?.token;
    } catch (error) {
      console.error('Error obtaining payment key:', error?.message);
      if (error.response) {
        console.error('Paymob API Error Response:', error.response.data);
      }
      throw new Error('Failed to obtain payment key');
    }
  }

  async paymentIFrame(paymentToken: string): Promise<void> {
    try {
      const iframeId: string = '844345'; // Your iframe ID
      const url = `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

      const response: AxiosResponse<any> = await axios.post(url);

      return response.data;
    } catch (error) {
      // Handle errors here
      console.error('Error in paymentIFrame:', error);
      throw new Error('Failed to load payment iFrame');
    }
  }
}
