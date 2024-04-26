import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    
    @Prop()
    userId: ObjectId; // For authenticated users

    @Prop()
    sessionId: ObjectId; // For guest users

    @Prop()
    items: CartItem[];

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

export const CartSchema = SchemaFactory.createForClass(Cart);

export interface CartItem {
    productId: ObjectId;
    quantity: number;
    rentalDuration?: string;
    isRented?: boolean;
}
