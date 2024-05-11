/* eslint-disable prettier/prettier */
//export schema as a model
// Path: authentication-service/src/user/user.model.ts

//import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
//import { User } from 'src/decorators/user.decorator';

export interface User extends mongoose.Document {
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    company: string;
    address: string;
    //username: string;
    password: string;
}
//export const userModel = SchemaFactory.createForClass(User);
