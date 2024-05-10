import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true, text: true  })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  imageURL: string[];

  @Prop({ default: true })
  availability: boolean;

  @Prop({ default: 0 })
  discountpercentage: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categoryId: MongooseSchema.Types.ObjectId;

  @Prop([String])
  sizes: string[];

  @Prop([String])
  colors: string[];

  @Prop([String])
  materials: string[];
  
  @Prop()
  totalPrice: number;

  @Prop()
  rating: number; //stars to display

  @Prop()
  totalRating: number; //total review star count

  @Prop()
  totalReviews: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);