import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();

    paymentController = app.get<PaymentController>(PaymentController);
    paymentService = app.get<PaymentService>(PaymentService);
  });

  describe('processPayment', () => {
    it('should return success when payment is successful', async () => {
      // Mock the paymentService.processPayment method to return a successful payment response
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue({ success: true, data: 'Successful payment response' });

      const result = await paymentController.processPayment({});

      expect(result.success).toBe(true);
      expect(result.error).toBe(undefined);
      expect(result.data).toBe('Successful payment response');
    });

    it('should return error when payment fails', async () => {
      // Mock the paymentService.processPayment method to return a payment error
      jest.spyOn(paymentService, 'processPayment').mockRejectedValue(new Error('Payment failed'));

      const result = await paymentController.processPayment({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment failed');
      expect(result.data).toBe(undefined);
    });
  });
});