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
            { name: Product.name, schema: ProductSchema },
            { name: Favorite.name, schema: FavoriteSchema }, 
            { name: Category.name, schema: CategorySchema },
            { name: Review.name, schema: ReviewSchema },
        ]),
    ],
    controllers: [ProductController],
    providers: [ProductService, ConsumerService, ProducerService, TaskService],
})
export class ProductModule {}