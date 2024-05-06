// src/payment/payment.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  async processPayment(paymentData: any): Promise<any> {
    try {
      const response = await axios.post(
        'https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge', //api for the testing (if not testing remove .fawrystaging)
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

}

const paymentData = {

  };
