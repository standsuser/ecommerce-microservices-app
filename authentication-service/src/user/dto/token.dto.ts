export class TokenDto{
    readonly token:string;
    readonly expiresIn:string;
    readonly refreshTokenexpiresIn:Date;
    readonly expired:Boolean;
    //readonly user:Types.ObjectId;
}