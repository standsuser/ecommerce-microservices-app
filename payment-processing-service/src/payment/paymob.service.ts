// paymob.service.ts

import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymobService {
  constructor(private readonly configService: ConfigService) { }
  async registerOrder(orderData: any): Promise<number> {
    const authToken = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjME9EWXdMQ0p3YUdGemFDSTZJalZpWlRCaVlqa3lORE0wWVdRMVlUZzRaVEZoWmpReFlUQTNNV1ZtT1RjM1l6QTRNRFF5WlRnME4yUmpaakkxTUdNeE9HRTRNV05qWm1KbVlUQmxPVGdpTENKbGVIQWlPakUzTVRVeU5UWTJNamg5LjlLd3lnRHEyRDc4QUN5UVd2VVpRb3g4YVJjRE1Fc2ZFWkhXbVNMV3BVTkYtd3pSaTU2bWc3NmpVenEzLWNxQl9HMDFOU1p6dU9UWFViZVpWMDIyVXRR';

    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/ecommerce/orders',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
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
    const authToken = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjME9EWXdMQ0p3YUdGemFDSTZJalZpWlRCaVlqa3lORE0wWVdRMVlUZzRaVEZoWmpReFlUQTNNV1ZtT1RjM1l6QTRNRFF5WlRnME4yUmpaakkxTUdNeE9HRTRNV05qWm1KbVlUQmxPVGdpTENKbGVIQWlPakUzTVRVeU5UWTJNamg5LjlLd3lnRHEyRDc4QUN5UVd2VVpRb3g4YVJjRE1Fc2ZFWkhXbVNMV3BVTkYtd3pSaTU2bWc3NmpVenEzLWNxQl9HMDFOU1p6dU9UWFViZVpWMDIyVXRR';

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

      // Log the response data for debugging
      console.log('Paymob API Response:', response.data);

      // Assuming response includes a token
      return response?.data?.token;
    } catch (error) {
      // Log detailed error message and response for debugging
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

      // Handle response data here if needed
      return response.data;
    } catch (error) {
      // Handle errors here
      console.error('Error in paymentIFrame:', error);
      throw new Error('Failed to load payment iFrame');
    }
  }
}
