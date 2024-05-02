import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type PaymentDocument = Payment & Document;

@Schema()
export class Payment{
  @Prop()
  amount: number;

  @Prop({ required: true })  
  currency: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: String, enum: ['pending', 'completed', 'failed'], required: true })
  status: string;

  @Prop()
  user: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);