import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Coupon extends Document {
    @Prop()
    coupon_code: string;

    @Prop()
    coupon_percentage: number;

    @Prop()
    limited: boolean;

    @Prop({ required: function(this: Coupon) { return this.limited; } })
    quantity?: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
