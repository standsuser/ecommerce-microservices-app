import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private username: string;
  private password: string;
  private apiKey: string;

  async authenticate(): Promise<string> {
    try {
      this.username = process.env.AUSERNAME;
      this.password = process.env.PASSWORD;
      this.apiKey = process.env.API_KEY;
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/auth/tokens',
        { username: this.username, password: this.password, api_key: this.apiKey },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = response.data.token;
      return token;
    } catch (error) {
      console.error('Error during authentication:', error);
      throw new Error('Failed to authenticate');
    }
  }
}
