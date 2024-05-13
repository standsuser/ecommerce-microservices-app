/* eslint-disable prettier/prettier */

import { Connection } from 'mongoose';
import { SessionModel } from '../session/session.model';

export const sessionProvider = [
  {
    provide: 'SESSION_MODEL',
    useFactory: (connection: Connection) => connection.model('Session', SessionModel),
    inject: ['DATABASE_CONNECTION'],
  },
];
