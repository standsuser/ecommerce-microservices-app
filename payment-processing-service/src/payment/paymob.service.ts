import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymobService {
  constructor(
    private readonly authService: AuthService,
  ) { }

  //on listen place order  
  
  async generateOrderWithAuthToken(orderData: any ): Promise<any> {
    try {
      const authToken = await this.authService.authenticate();

      const config = {
        "auth_token": authToken,
        ...orderData, // Merge the rest of the orderData with additional properties
      };
      return config;

    } catch (error) {
      console.error('Error generating config:', error);
      throw new Error('Failed to generate config');
    }
  }

  async registerOrder(orderData: any): Promise<number> {
    try {
      
      orderData = await this.generateOrderWithAuthToken(orderData);
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/ecommerce/orders',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${orderData.auth_token}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      console.error('Error obtaining payment key:', error?.message);
      if (error.response) {
        console.error('Paymob API Error Response:', error.response.data);
      }
      throw new Error('Failed to obtain payment key');
    }
  }

  // on listen checkout

  async generatePaymentWithAuthToken(orderData: any, orderId: any): Promise<any> {
    try {
      // Get the authentication token from the AuthService

      const authToken = await this.authService.authenticate();
      const config = {
        "auth_token": authToken,
        "orderId": orderId,
        ...orderData 
      };
      return config;
    } catch (error) {
      console.error('Error generating config:', error);
      throw new Error('Failed to generate config');
    }
  }
  async getPaymentKey(paymentData: any, orderId: any): Promise<string> {
    paymentData = await this.generatePaymentWithAuthToken(paymentData, orderId); 
    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/acceptance/payment_keys',
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paymentData.authToken}`,
          },
        }
      );
      console.log('Paymob API Response:', response.data);
      //clear cart by kafka prodcutor yaes
      return response?.data;
    } catch (error) {
      console.error('Error obtaining payment key:', error.message);
      throw new Error('Failed to obtain payment key');

    }
  }
}
