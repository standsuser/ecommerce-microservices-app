import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class Cart extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    userid?: Types.ObjectId;

    @Prop({ type: String })
    session_id?: string;

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

    @Prop({ default: 0 })
    total_price_pre_coupon: number;

    @Prop({ default: null })
    total_price_post_coupon: number;

    @Prop({ default: null })
    coupon_code: string;

    @Prop({ default: 0 })
    coupon_percentage: number;

    @Prop({ default: false })
    is_checkout: boolean;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
