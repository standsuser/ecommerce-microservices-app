import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './product.service';
import { Cart, CartItemSchema } from './schema/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartItemSchema }])
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}
