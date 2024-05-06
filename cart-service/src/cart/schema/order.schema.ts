import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from 'mongoose';

export type OrderDocument = Order & Document;

enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

@Schema()
export class Order {
    @Prop()
    userId: string;

    @Prop()
    orderNumber: string;

    @Prop()
    orderDate: Date;

    @Prop()
    total: number;

    @Prop()
    items: { productId: ObjectId, quantity: number }[];

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderStatus }; 