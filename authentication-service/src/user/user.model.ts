/* eslint-disable prettier/prettier */

import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true },//login using email
    phone_number: { type: String, required: false  },
    company: { type: String, required: false },
    apartment: { type: String, required: false },
    floor: { type: String, required: false },
    street: { type: String, required: false },
    building: { type: String, required: false },
    postal_code: { type: String, required: false },
    extra_description: { type: String , required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    addresslabel: { type: String, required: false }, 
    state: { type: String, required: false }, 
    password: { type: String, required: true }//login using password
});
