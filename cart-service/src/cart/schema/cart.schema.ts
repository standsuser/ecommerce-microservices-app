import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Cart extends Document {
    @Prop()
    @Prop({ type: MongooseSchema.Types.ObjectId})
    userid?: MongooseSchema.Types.ObjectId;

    @Prop()
    session_id?: MongooseSchema.Types.ObjectId; // For guest users

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
    total_price_pre_coupon: number; //lained

    @Prop()
    total_price_post_coupon: number | null;

    @Prop()
    coupon_code: string | null;

    @Prop()
    coupon_percentage: number| null;

    @Prop()
    is_checkout: boolean;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);