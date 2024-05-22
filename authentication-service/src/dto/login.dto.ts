/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
export class LoginDto{
    readonly username: String;
    readonly password: String; 
    readonly check: boolean;

    toString(){
        return JSON.stringify({
            
            username:this.username,
            password:this.password,
            check:this.check}
        );
    }
}
