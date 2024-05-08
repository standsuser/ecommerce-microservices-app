
import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
    async authenticate(username: string, password: string, apiKey: string): Promise<string> {
        try {
          const response: AxiosResponse<any> = await axios.post(
            'https://accept.paymob.com/api/auth/tokens',
            { username, password, api_key: apiKey },
            { headers: { 'Content-Type': 'application/json' } }
          );
      
          // Assuming response includes a token
          return response?.data?.token;
        } catch (error) {
          console.error('Error during authentication:', error);
          throw new Error('Failed to authenticate');
        }
      }
}