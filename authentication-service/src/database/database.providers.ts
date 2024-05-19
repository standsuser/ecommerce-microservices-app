/* eslint-disable prettier/prettier */

import * as mongoose from 'mongoose';
//import * as dotenv from 'dotenv';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://omarx10050:12345@users.bez5bwk.mongodb.net/'),//databasename
  },
];
