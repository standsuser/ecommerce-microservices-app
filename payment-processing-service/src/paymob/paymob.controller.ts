import { Controller, Post, Body } from '@nestjs/common';
import { PaymobService } from './paymob.service';

@Controller('paymob')
export class PaymobController {
    constructor(private readonly paymobService: PaymobService) {}

    @Post('make-payment')
    async makePayment(
        @Body('amount') amount: number,
        @Body('currency') currency: string,
        @Body('paymentMethods') paymentMethods: string,
        @Body('items') items: any[],
        @Body('billingData') billingData: any,
        @Body('customer') customer: any,
        @Body('extras') extras: any
    ): Promise<any> {
        try {
            const paymentResponse = await this.paymobService.makePayment(
                amount,
                currency,
                paymentMethods,
                items,
                billingData,
                customer,
                extras
            );
            return paymentResponse;
        } catch (error) {
            console.error('Error making payment:', error);
            throw error;
        }
    }
}
