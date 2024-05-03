export class TokenDto{
    readonly token:string;
    readonly expiresIn:string;
    readonly refreshTokenexpiresIn:Date;
    readonly expired:Boolean;
    //readonly user:Types.ObjectId;

    toString(): string {
        return JSON.stringify({
            token: this.token,
            expiresIn: this.expiresIn,
            refreshTokenexpiresIn: this.refreshTokenexpiresIn,
            expired: this.expired,
            //user:this.user
        });
    }

}