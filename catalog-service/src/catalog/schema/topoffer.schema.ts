/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 


@Schema()
export class Offer extends Document{
  @Prop({ type: Types.ObjectId, required: true }) 
  productId: Types.ObjectId;

  @Prop({ required: true }) 
  discountpercentage: number;

}

export const TopOffer = SchemaFactory.createForClass(Offer);
