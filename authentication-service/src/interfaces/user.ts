/* eslint-disable prettier/prettier */
// Path: authentication-service/src/user/user.model.ts

import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  phonenumber: string;
  company: string;
  apartment: string;
  floor: string;
  street: string;
  building: string;
  postal_code: string;
  extra_description: string;
  city: string;
  country: string;
  addresslabel: string;
  state: string;
  password: string;
}


