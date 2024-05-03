import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymobService {
    async makePayment(
      amount: number,
      currency: string,
      paymentMethods: string,
      items: any[],
      billingData: any,
      customer: any,
      extras: any
    ): Promise<any> {
      try {
          // Set your Paymob API token
          const API_TOKEN = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjME9EWXdMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuVTJELWZOQTM1VG9qWnFTay1USHFRX3BNX1FrRm5VdnFuWFlQMUxFTGdiWUJaQzg1dGlNQlVvVS1hZDA4UjlCZFp3MWFDaWVlN0RrdTFMQ1FPUVJRdFE="; // Replace with your actual API token

          // Define the payment data
          const paymentData = {
              amount,
              currency,
              payment_methods: paymentMethods,
              items,
              billing_data: billingData,
              customer,
              extras
          };

            // Define Axios request configuration
            const requestOptions = {
                headers: {
                    "Authorization": `Token ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            };

            // Make a POST request to Paymob API
            const response = await axios.post("https://accept.paymob.com/v1/intention/", paymentData, requestOptions);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}
