import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AddressDocument = Address & Document;

@Schema()
export class Address {
    
    @Prop()
    userId: string;

    @Prop()
    country: string;

    @Prop()
    city: string;

    @Prop()
    street: string;

    @Prop()
    label: string;

    @Prop()
    zipCode: string;
}




export const AddressSchema = SchemaFactory.createForClass(Address);