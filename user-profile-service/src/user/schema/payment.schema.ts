import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Address } from "./address.schema";

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
    
    @Prop()
    userId: string; 
    
    @Prop()
    billingAddress: Address; 

    @Prop()
    debitOrCredit: string; // "debit" or "credit"

    @Prop()
    cardNumber: string;

    @Prop()
    cvv: string;

    @Prop()
    expiryDate: string;

    @Prop()
    cardHolderName: string;
  }

export const PaymentSchema = SchemaFactory.createForClass(Payment);