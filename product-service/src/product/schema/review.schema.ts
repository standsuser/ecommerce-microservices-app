

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Document as DocumentMongoose } from 'mongoose';
import { Schema as SchemaMongoose } from 'mongoose';


@Schema()
export class Review extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    userid: MongooseSchema.Types.ObjectId;
    
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productid: MongooseSchema.Types.ObjectId;
    
    @Prop({ required: true })
    rating: number;
    
    @Prop({ required: true })
    review: string;
    
    @Prop({ type: Date, default: Date.now })
    reviewdate: Date;

   


    }


export const ReviewSchema = SchemaFactory.createForClass(Review);