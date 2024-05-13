import { Inject, Injectable, Logger } from '@nestjs/common';
import { Session } from 'inspector';
import { Model, ObjectId } from 'mongoose';
import { SessionModel } from './session.model';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';







@Injectable()
export class SessionService {
    constructor(     
           @Inject('SESSION_MODEL')
              private sessionModel: Model<Session>,
              private jwtService: JwtService,

            ) {
           

}

async createSession(userID: string, access_token: string, ) {
    const session = new this.sessionModel({ userID, access_token, createdAt: new Date() , isGuest: false});
    return session.save();
}

async createGuestSession() {
    const guestID = await this.generateRandomString(24);
    Logger.log(guestID)
    const session = new this.sessionModel({ guestID, createdAt: new Date(), isGuest: true });
    Logger.log(session)
    return session.save();
}

/////here is the concept to add the cart data
async updateSession(userID: string, guestID: string , access_token: string){
    const session = await this.findSessionByGuestId(guestID);
    const newSession = new this.sessionModel({ userID, access_token, createdAt: new Date(), isGuest: false });
    if (newSession) {
        await this.sessionModel.findByIdAndDelete(session)
        return newSession.save();
    }

    Logger.log('Session updated successfully')

    

    
    
}




async findSessionByUserId(userID: string) {
    return this.sessionModel.findOne({ userID });


}

async findSessionByGuestId(guestID: string) {
    return this.sessionModel.findOne({ guestID });
}

async deleteSession(userID: string) {
    const session = await this.findSessionByUserId(userID);
    if (session) {
        await this.sessionModel.findByIdAndDelete(session._id)
        return "Session deleted successfully";
    }else{
        return "Session not found";
    }

    

}

async generateRandomString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async validateSession(id: string) {
    const session = await this.findSessionByUserId(id);
    if (session) {
        return true;
    }
}








}