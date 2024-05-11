import * as mongoose from 'mongoose';

export const SessionModel = new mongoose.Schema({
    userID: { type: String, required: false },
    access_token: { type: String, required: false },
    expiresAt: { type: Date, required: false },
    createdAt: { type: Date, required: false },
    isGuest: { type: Boolean, default: false }, // Indicates if the session belongs to a guest
    guestID: { type: String, required: false }, // If the session belongs to a guest, this will be the guest ID

    
});

