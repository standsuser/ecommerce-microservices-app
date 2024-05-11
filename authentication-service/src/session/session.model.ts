import * as mongoose from 'mongoose';

export const SessionModel = new mongoose.Schema({
    userID: { type: String, required: true },
    access_token: { type: String, required: true },
    expiresAt: { type: Date, required: false },
    createdAt: { type: Date, required: false }
    
});

