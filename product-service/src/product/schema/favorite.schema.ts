/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Favorite extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userid: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productid: MongooseSchema.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);


