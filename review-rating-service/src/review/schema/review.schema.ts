// review.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  productId: number;

  @Prop({ required: true })
  rating: number; // from 1 to 5

  @Prop({ required: true })
  title: string;

  //@Prop()
  //comments: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
