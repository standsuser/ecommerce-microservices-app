import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    
    @Prop()
    userId: string; // For authenticated users

    @Prop()
    sessionId: string; // For guest users

    @Prop([{ productId: String, quantity: Number }])
    items: { productId: string, quantity: number }[];

    @Prop()
    totalPricePreCoupon: number;

    @Prop()
    totalPricePostCoupon: number;

    @Prop()
    couponCode: string;

    @Prop()
    couponPercentage: number;

    @Prop()
    isCheckout: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

}

export const CartItemSchema = SchemaFactory.createForClass(Cart);
