import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  imageURL: string[];

  @Prop({ default: true })
  availability: boolean;

  @Prop({ default: 0 })
  discountpercentage: number;

  @Prop({ type: Date })
  discountenddate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryid: MongooseSchema.Types.ObjectId;

  @Prop()
  size: string;

  @Prop()
  color: string;

  @Prop()
  material: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

@Schema()
export class Favorite extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userid: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productid: MongooseSchema.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
