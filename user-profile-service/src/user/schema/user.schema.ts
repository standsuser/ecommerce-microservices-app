import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address, AddressDocument } from "./address.schema";
import {Payment, PaymentDocument } from "./payment.schema";
import { Wishlist, WishlistDocument } from "./wishlist.schema";
import { Review, ReviewDocument } from "../../../../review-rating-service/src/review/schema/review.schema";

export type UserDocument = User & Document;


@Schema()
export class User {
    @Prop()
    firstName: string;
    
    @Prop()
    lastName: string;
    
    @Prop()
    email: string;
    
    @Prop()
    password: string;
    
    @Prop({ type: Payment })
    payment: Payment;

    @Prop()
    phone: string;
    
    @Prop({ optional: true })
    company?: string;
    
    // Address as an array of Address objects
    @Prop({ type: Address })
    addresses?: Address[];

    @Prop()
    previousOrders?: Order[];

    @Prop()
    previousReviews?: Review[];

}


export const UserSchema = SchemaFactory.createForClass(User);
