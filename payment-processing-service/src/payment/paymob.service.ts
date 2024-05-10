import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymobService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }
  async onModuleInit() {

  }

  async generateConfigWithAuthToken(orderData: any): Promise<any> {
    try {
      // Get the authentication token from the AuthService
      const authToken = await this.authService.authenticate();

      const config = {
        ...orderData, // Merge the orderData with additional properties
        "auth_token": authToken
      };
      //ask mariam about kafkaking the transferred data  

      return config;
    } catch (error) {
      console.error('Error generating config:', error);
      throw new Error('Failed to generate config');
    }
  }

  async registerOrder(orderData: any): Promise<number> {
    try {
      const config = await this.generateConfigWithAuthToken(orderData);

      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/ecommerce/orders',
        config,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.auth_token}`,
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
