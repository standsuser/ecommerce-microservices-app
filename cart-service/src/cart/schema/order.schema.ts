import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    SUCCESSFUL = 'successful',
    DECLINED = 'declined'
}

@Schema()
export class Order {
    @Prop()
    user_id: MongooseSchema.Types.ObjectId;

    @Prop()
    order_id: number;

    @Prop()
    delivery_needed: boolean;

    @Prop()
    amount_cents: number;

    @Prop()
    currency: string;

    @Prop()
    merchant_order_id: number;

    @Prop()
    items: { product_id: MongooseSchema.Types.ObjectId, name: string, amount_cents: number /*call the function from laineymclainpants*/ , description: string, color: string, size: string, material: string, quantity: number }[];

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: string;

    @Prop()
    shipping_data: Address; 
    
    @Prop()
    payment_info: {
        order_id: number, amount_cents: number, expiration: 3600, 
        billing_data: Address,
        currency: 'EGP',
        integration_id: 4570504,
        lock_order_when_paid: 'false'
    }

    @Prop()
    shipping_details: /*{ notes: string, number_of_packages: number, weight: number, length: number, width: number, height: number, contents: string }*/ string
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderStatus }; 