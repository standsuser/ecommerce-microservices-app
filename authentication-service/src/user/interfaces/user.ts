//export schema as a model
// Path: authentication-service/src/user/user.model.ts

import mongoose from "mongoose";


export interface User extends mongoose.Document {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    company: string;
    address: string;
    verified: boolean;
}
