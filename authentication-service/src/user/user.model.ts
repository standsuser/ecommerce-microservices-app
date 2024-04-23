
import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
    verified: { type: Boolean },


});

//export it 

