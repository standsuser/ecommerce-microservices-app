import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
  userID: { type: String, required: false },
  access_token: { type: String, required: false },
  expiresAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now }, // Set default to current date/time
  isGuest: { type: Boolean, default: false }, // Indicates if the session belongs to a guest
  guestID: { type: String, required: false }, // If the session belongs to a guest, this will be the guest ID
});

export interface Session extends mongoose.Document {
  userID?: string;
  access_token?: string;
  expiresAt?: Date;
  createdAt: Date;
  isGuest: boolean;
  guestID?: string;
}
