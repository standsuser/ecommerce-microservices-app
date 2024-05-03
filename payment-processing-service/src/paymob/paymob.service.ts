import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymobService {
  private readonly PAYMOB_API_BASE_URL = 'https://accept.paymob.com/';
  private readonly apiKey: string;
  private readonly merchantId: string;

  constructor(private readonly httpService: HttpService) {
    // Load API credentials from configuration (you can use environment variables or a config file)
    this.apiKey = process.env.PAYMOB_API_KEY;
    this.merchantId = process.env.PAYMOB_MERCHANT_ID;
  }

  initiatePayment(orderId: string, amount: number): Observable<AxiosResponse<any>> {
    const url = `${this.PAYMOB_API_BASE_URL}acceptance/payment_keys`;
    const payload = {
      integration_id: this.apiKey,
      amount_cents: amount * 100, // Paymob accepts amount in cents
      currency: 'EGP', // Change to your currency code
      order_id: orderId,
      billing_data: {
        apartment: 'NA',
        email: 'customer@example.com', // Example email, replace with actual customer email
        floor: 'NA',
        first_name: 'John', // Example first name, replace with actual customer name
        street: 'NA',
        building: 'NA',
        phone_number: '+201000000000', // Example phone number, replace with actual customer phone number
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'NA',
        last_name: 'Doe', // Example last name, replace with actual customer name
        state: 'NA',
      },
    };
    return this.httpService.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  }

  queryPaymentStatus(paymentKey: string): Observable<AxiosResponse<any>> {
    const url = `${this.PAYMOB_API_BASE_URL}acceptance/payment_key/${paymentKey}/status`;
    return this.httpService.get(url);
  }
}