// featuredlisting.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 

@Schema()
export class FeaturedListing extends Document {
  @Prop({ type: Types.ObjectId, required: true }) 
  productId: Types.ObjectId;

  @Prop({ required: true })
  totalRating: number;
}

export const FeaturedListingSchema =
  SchemaFactory.createForClass(FeaturedListing);
