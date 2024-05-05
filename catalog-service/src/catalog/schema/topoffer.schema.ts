import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true }) 
  discountPercentage: number;

}

export const TopOffer = SchemaFactory.createForClass(Offer);
