import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document , Schema as MongooseSchema } from "mongoose";

export type WishlistDocument = Wishlist & Document;

@Schema()
export class Wishlist {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userid: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  productid: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  selectedSize: string;  
  
  @Prop()
  selectedMaterial: string;  
  
  @Prop()
  selectedColor: string;

  @Prop()
  price: number;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
// implement wishlistitem document with the properties of the item itself
// subscribe to calculate price in product-service?
