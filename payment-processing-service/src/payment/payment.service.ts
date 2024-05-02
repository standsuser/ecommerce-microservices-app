// payment.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { HttpService } from '@nestjs/axios'; 
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private httpService: HttpService, // Injecting HttpService for making HTTP requests
  ) {}

  async createPayment(paymentDto: CreatePaymentDto): Promise<Payment> {
    const createdPayment = new this.paymentModel(paymentDto);
    return createdPayment.save();
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    return this.paymentModel.findById(paymentId).exec();
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<Payment> {
    return this.paymentModel.findByIdAndUpdate(paymentId, { status }, { new: true }).exec();
  }

  async processPayment(paymentDto: CreatePaymentDto): Promise<any> {
    // Here you would integrate with the external payment gateway's API
    // Example: Sending a POST request to the gateway's API endpoint
    const gatewayApiUrl = 'https://example-payment-gateway.com/api/process-payment';
    try {
      const response = await this.httpService.post(gatewayApiUrl, paymentDto).toPromise();
      return response.data;
    } catch (error) {
      throw new Error('Failed to process payment'); // Handle errors appropriately
    }
  }
}
