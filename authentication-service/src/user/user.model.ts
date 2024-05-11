/* eslint-disable prettier/prettier */

import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true ,unique:true},//login using email
    phonenumber: { type: String, required: true },
    company: { type: String, required: false },
    address: { type: String, required: true }, 
    password: { type: String, required: true }//login using password
});

//export it 

