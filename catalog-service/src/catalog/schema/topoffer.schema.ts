import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
  @Prop({ required: true })
  productId: string;

  // @Prop({ required: true }) // kafka ya shabab rakzo abos edeko
  // discountPercentage: number;

  // @Prop({ required: true })
  // validityPeriod: Date;

}

export const TopOffer = SchemaFactory.createForClass(Offer);
