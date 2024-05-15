import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schema/cart.schema';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { Order, OrderSchema } from './schema/order.schema';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: Coupon.name, schema: CouponSchema },
            { name: Order.name, schema: OrderSchema },
        ]),
    ],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule { }

