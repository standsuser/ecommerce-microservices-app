import {
    Injectable,
    NotFoundException,
    Req,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Address } from './schema/address.schema';
  import { Payment } from './schema/payment.schema';
  import { Wishlist } from './schema/wishlist.schema';
  import { ProducerService } from '../kafka/producer.service';
  
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectModel(Address.name) private readonly addressModel: Model<Address>,
      @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
      @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
      private readonly producerService: ProducerService,
    ) {}
  
    async sendTopDiscountedProducts() {

    }
}