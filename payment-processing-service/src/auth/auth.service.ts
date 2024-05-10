import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService implements OnModuleInit {
  private username: string;
  private password: string;
  private apiKey: string;

  async onModuleInit() {
    try {
      this.username = process.env.AUSERNAME;
      this.password = process.env.PASSWORD;
      this.apiKey = process.env.API_KEY;

      await this.authenticate();
    } catch (error) {
      console.error('Error reading .env file:', error);
      throw new Error('Failed to read authentication details from .env file');
    }
  }

  async authenticate(): Promise<string> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://accept.paymob.com/api/auth/tokens',
        { username: this.username, password: this.password, api_key: this.apiKey },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = response?.data?.token;
      console.log('Authentication token:', token);
      return token;
    } catch (error) {
      console.error('Error during authentication:', error);
      throw new Error('Failed to authenticate');
    }
  }
}
// AUTHENTICATION IS NOW AUTOMATIC
