// featuredlisting.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class FeaturedListing extends Document {
  @Prop({ required: true })
  productId: ObjectId;

  @Prop({ required: true })
  totalRating: number;
}

export const FeaturedListingSchema =
  SchemaFactory.createForClass(FeaturedListing);
