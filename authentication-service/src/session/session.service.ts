import { Inject, Injectable, Logger } from '@nestjs/common';
import { Session } from 'inspector';
import { Model, ObjectId } from 'mongoose';
import { SessionModel } from './session.model';







@Injectable()
export class SessionService {
    constructor(     
           @Inject('SESSION_MODEL')
              private sessionModel: Model<Session>
            ) {
           

}

async createSession(userID: string, access_token: string, ) {
    const session = new this.sessionModel({ userID, access_token, createdAt: new Date() });
    return session.save();
}

async findSessionByUserId(userID: string) {
    return this.sessionModel.findOne({ userID });


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

async validateSession(id: string) {
    const session = await this.findSessionByUserId(id);
    if (session) {
        return true;
    }
}








}