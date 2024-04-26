// topoffer.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class TopOffer extends Document {
  @Prop({ required: true })
  productId: ObjectId;

  //@Prop({ required: true })
  //discountPercentage: number;

  
}

export const TopOfferSchema = SchemaFactory.createForClass(TopOffer);
