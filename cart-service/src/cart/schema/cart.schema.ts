import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class Cart extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    userid?: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    session_id?: Types.ObjectId; // For guest users

    @Prop()
    items: {
        productId: any;
        rentalDuration: string;
        isRented: boolean; 
        name: string, 
        amount_cents: number,
        description: string, 
        color: string, 
        size: string, 
        material: string, 
        quantity: number
    }[];

    @Prop()
    total_price_pre_coupon: number;

    @Prop()
    total_price_post_coupon: number | null;

    @Prop()
    coupon_code: string | null;

    @Prop()
    coupon_percentage: number | null;

    @Prop()
    is_checkout: boolean;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
