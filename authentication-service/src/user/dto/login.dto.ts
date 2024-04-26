export class LoginDto{
    readonly username: String;
    readonly password: String; 

    toString(){
        return JSON.stringify({
            
            username:this.username,
            password:this.password}
        );
    }
}
