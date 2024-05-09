import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AuthService implements OnModuleInit {
  private username: string;
  private password: string;
  private apiKey: string;

  async onModuleInit() {
    try {
      const authData = JSON.parse(fs.readFileSync('./auth/json/auth.json', 'utf8'));
      this.username = authData.username;
      this.password = authData.password;
      this.apiKey = authData.apiKey;
    } catch (error) {
      console.error('Error reading auth.json:', error);
      throw new Error('Failed to read authentication details');
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