import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 


@Schema()
export class Offer {
  @Prop({ type: Types.ObjectId, required: true }) 
  productId: Types.ObjectId;

  @Prop({ required: true }) 
  discountPercentage: number;

}

export const TopOffer = SchemaFactory.createForClass(Offer);
