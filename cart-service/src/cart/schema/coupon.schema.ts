import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Coupon extends Document {
    @Prop()
    coupon_code: string;

    @Prop()
    coupon_percentage: number;

}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
