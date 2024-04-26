export class CreateUserDto{
    readonly name: String;
    readonly username: String;
    readonly password: String; 

    toString(){
        return JSON.stringify({
            name:this.name,
            username:this.username,
            password:this.password}
        );
    }
}