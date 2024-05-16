import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller'; 
import { UserService } from './user.service'; 
import { Address, AddressSchema } from './schema/address.schema'; 
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Wishlist, WishlistSchema } from './schema/wishlist.schema';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
// import { TaskService } from 'src/task/task.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Address.name, schema: AddressSchema },
            { name: Payment.name, schema: PaymentSchema },
            { name: Wishlist.name, schema: WishlistSchema }
        ]),
    ],
    controllers: [UserController],
    providers: [UserService, ConsumerService, ProducerService],
})
export class UserModule {}