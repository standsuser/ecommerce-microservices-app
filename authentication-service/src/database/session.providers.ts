/* eslint-disable prettier/prettier */

import { Connection } from 'mongoose';
import { SessionSchema } from '../session/session.model';

export const sessionProvider = [
  {
    provide: 'SESSION_MODEL',
    useFactory: (connection: Connection) => connection.model('Session', SessionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
