import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


export type ReviewDocument = Review & Document;

@Schema()
export class Review {
    
    @Prop()
    userId: string;

    @Prop()
    productId: string;

    @Prop()
    rating: number;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
   
  }

export const PaymentSchema = SchemaFactory.createForClass(Review);