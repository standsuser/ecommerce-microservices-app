import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WishlistDocument = Wishlist & Document;

@Schema()
export class Wishlist {
  @Prop()
  userId: string;

  @Prop()
  productId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  selectedSize: string;  
  
  @Prop()
  selectedMaterial: string;  
  
  @Prop()
  selectedColor: string;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
// implement wishlistitem document with the properties of the item itself
// subscribe to calculate price in product-service?
