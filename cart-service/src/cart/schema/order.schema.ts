import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';


enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    SUCCESSFUL = 'successful',
    DECLINED = 'declined'
}

class Item {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    product_id: MongooseSchema.Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    amount_cents: number;

    @Prop()
    description: string;

    @Prop()
    color: string;

    @Prop()
    size: string;

    @Prop()
    material: string;

    @Prop()
    quantity: number;
}

class ShippingData {
    @Prop()
    apartment: string;

    @Prop()
    email: string;

    @Prop()
    floor: string;

    @Prop()
    first_name: string;

    @Prop()
    street: string;

    @Prop()
    building: string;

    @Prop()
    phone_number: string;

    @Prop()
    postal_code: string;

    @Prop()
    extra_description: string | null;

    @Prop()
    city: string;

    @Prop()
    country: string;

    @Prop()
    last_name: string;

    @Prop()
    state: string;
}

class BillingData {
    @Prop()
    apartment: string;

    @Prop()
    email: string;

    @Prop()
    floor: string;

    @Prop()
    first_name: string;

    @Prop()
    street: string;

    @Prop()
    building: string;

    @Prop()
    phone_number: string;

    @Prop()
    postal_code: string;

    @Prop()
    extra_description: string;

    @Prop()
    city: string;

    @Prop()
    country: string;

    @Prop()
    last_name: string;

    @Prop()
    state: string;
}

class PaymentInfo {
    @Prop()
    order_id: number;

    @Prop()
    amount_cents: number;

    @Prop()
    expiration: number;

    @Prop({ type: BillingData })
    billing_data: BillingData;

    @Prop()
    currency: string;

    @Prop()
    integration_id: number;

    @Prop()
    lock_order_when_paid: string;
}

@Schema()
export class Order extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userid: MongooseSchema.Types.ObjectId;

    @Prop()
    delivery_needed: boolean;

    @Prop()
    amount_cents: number;

    @Prop()
    currency: string;

    @Prop()
    merchant_order_id: number;

    @Prop({ type: [Item] })
    items: Item[];

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: string;

    @Prop({ type: ShippingData })
    shipping_data: ShippingData;

    @Prop({ type: PaymentInfo })
    payment_info: PaymentInfo;

}

export const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderStatus };
