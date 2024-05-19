/* eslint-disable prettier/prettier */

import * as mongoose from 'mongoose';
//import * as dotenv from 'dotenv';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://localhost:27018/authentication'),//databasename
  },
];
