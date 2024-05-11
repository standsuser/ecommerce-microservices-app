import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AddressDocument = Address & Document;

@Schema()
export class Address {

    @Prop()
    userId: string;

    @Prop()
    apartment: string

    @Prop()
    email: string

    @Prop()
    floor: number

    @Prop()
    first_name: string

    @Prop()
    street: string

    @Prop()
    building: string

    @Prop()
    phone_number: string

    @Prop()
    postal_code: number

    @Prop()
    extra_description: string | null

    @Prop()
    city: string

    @Prop()
    country: string

    @Prop()
    last_name: string

    @Prop()
    state: string
}




export const AddressSchema = SchemaFactory.createForClass(Address);