import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymobService {

  

    async makePayment() {
      try {
        const headers = {
          Authorization: 'egy_sk_live_b08759deedde87f612b6cde8e2ab2a914f0d35bfef0519a4b21032c6165c2bf0',
          'Content-Type': 'application/json',
        };
  
        const data = {
          amount: 10,
          currency: 'EGP',
          payment_methods: [12, 'card', 'you can add Integration id directly or your integration name'],
          items: [
            {
              name: 'Item name 1',
              amount: 10,
              description: 'Watch',
              quantity: 1,
            },
          ],
          billing_data: {
            apartment: '6',
            first_name: 'Ammar',
            last_name: 'Sadek',
            street: '938, Al-Jadeed Bldg',
            building: '939',
            phone_number: '+96824480228',
            country: 'OMN',
            email: 'AmmarSadek@gmail.com',
            floor: '1',
            state: 'Alkhuwair',
          },
          customer: {
            first_name: 'Ammar',
            last_name: 'Sadek',
            email: 'AmmarSadek@gmail.com',
            extras: {
              re: '22',
            },
          },
          extras: {
            ee: 22,
          },
        };
  
        const response = await axios.post('https://accept.paymob.com/v1/intention/', data, { headers });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }
  }