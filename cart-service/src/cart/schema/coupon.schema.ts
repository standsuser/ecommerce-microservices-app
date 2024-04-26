import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema()
export class Coupon {
    @Prop()
    couponCode: string;

    @Prop()
    couponPercentage: number;

    @Prop()
    expires: Date; //implement 

    @Prop()
    limited: boolean;

    @Prop({ required: function(this: Coupon) { return this.limited; } })
    quantity?: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
