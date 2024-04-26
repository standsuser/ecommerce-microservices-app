
import { Connection } from 'mongoose';
import { UserModel } from '../user.model';

export const userProvider = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserModel),
    inject: ['DATABASE_CONNECTION'],
  },
];
