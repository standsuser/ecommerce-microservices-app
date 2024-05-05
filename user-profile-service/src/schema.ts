import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User  extends Document{
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Address' }] }) // Ensure proper reference to Address
  addresses: Types.Array<Types.ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  items: any[];

  @Prop()
  total: number;

  @Prop()
  date: Date;

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// @Schema()
// export class PaymentMethod {
//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   userId: Types.ObjectId;

//   @Prop({ required: true })
//   cardNumber: string;

//   @Prop({ required: true })
//   expiryDate: string;

//   @Prop({ required: true })
//   cardHolderName: string;

//   @Prop({ required: true })
//   cvv: string;
// }

// export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

@Schema()
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop()
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
