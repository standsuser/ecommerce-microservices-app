//export schema as a model
// Path: authentication-service/src/user/user.model.ts

import mongoose from "mongoose";


export interface User extends mongoose.Document {
    name: string;
    username: string;
    password: string;
   
}
