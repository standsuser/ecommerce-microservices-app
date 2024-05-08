// paymob.service.ts

import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymobService {
  constructor(private readonly configService: ConfigService) {}
  async registerOrder(orderData: any): Promise<number> {
    const authToken = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjME9EWXdMQ0p3YUdGemFDSTZJalZpWlRCaVlqa3lORE0wWVdRMVlUZzRaVEZoWmpReFlUQTNNV1ZtT1RjM1l6QTRNRFF5WlRnME4yUmpaakkxTUdNeE9HRTRNV05qWm1KbVlUQmxPVGdpTENKbGVIQWlPakUzTVRVd09ERTRPVEo5Ljh5Z1Nzc3I5M0EtUTlDVC1fSDREdzNsN2Z2elQ5R01qMWNQaWgxRi1YcHNZYWY2OXdLbm04ODRnRXd0bmI1WUNVS091OXpkREZpTDZjNm1qU0dwb293';

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
      return response?.data?.id;
    } catch (error) {
      console.error('Error registering order:', error);
      throw new Error('Failed to register order');
    }
  }
  async getPaymentKey(paymentData: any): Promise<string> {
    const authToken = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjME9EWXdMQ0p3YUdGemFDSTZJalZpWlRCaVlqa3lORE0wWVdRMVlUZzRaVEZoWmpReFlUQTNNV1ZtT1RjM1l6QTRNRFF5WlRnME4yUmpaakkxTUdNeE9HRTRNV05qWm1KbVlUQmxPVGdpTENKbGVIQWlPakUzTVRVd056Y3lNRFI5LjVtR1lZUlltQVhsMnJ0bHN0SllrR1dWQkNIYW9SLVVhR2RSRDRSQWZIdXZzWkZfR3hUblJaRUNiN09IRXBoZE5BVVItVHVrR2ViTWo4ZWtadXpRMDdB';

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

      // Assuming response includes a token
      return response?.data?.token;
    } catch (error) {
      console.error('Error obtaining payment key:', error);
      throw new Error('Failed to obtain payment key');
    }
  }
}
