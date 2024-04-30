// catalog.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProductCatalog extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;



 
}

export const ProductCatalogSchema = SchemaFactory.createForClass(ProductCatalog);
