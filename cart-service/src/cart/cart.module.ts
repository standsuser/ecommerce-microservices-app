import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schema/cart.schema';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { Order, OrderSchema } from './schema/order.schema';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
        MongooseModule.forFeature([{ name: 'Coupon', schema: CouponSchema }]),
        MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}
