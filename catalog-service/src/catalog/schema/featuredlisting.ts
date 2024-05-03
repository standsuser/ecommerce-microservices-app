// featuredlisting.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class FeaturedListing extends Document {
  @Prop({ required: true })
  productId: ObjectId;

  //@Prop({ required: true })
  // rating: number;
}

export const FeaturedListingSchema =
  SchemaFactory.createForClass(FeaturedListing);
