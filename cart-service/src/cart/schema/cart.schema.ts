import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    
    @Prop()
    userId: string;

    @Prop([{ productId: String, quantity: Number }])
    items: { productId: string, quantity: number }[];

    @Prop()
    totalPricePreCoupon: number;

    @Prop()
    totalPricePostCoupon: number;

    @Prop()
    couponCode: string;

    @Prop()
    isCheckout: boolean;

}

export const CartItemSchema = SchemaFactory.createForClass(Cart);
