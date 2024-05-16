import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema()
export class Address {

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    userid: MongooseSchema.Types.ObjectId;

    addresslabel: string

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