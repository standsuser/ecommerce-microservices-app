import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "../dto/login.dto";
import { UserNotFoundException } from "../exceptions/userNotfound.exception";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
constructor(private readonly userService:UserService){
    super();
}
async validate(username:string, password:string):Promise<any>{
    console.log('validate:' ,username,password);

    var loginDto:LoginDto ={
        username,password
    }
    const user = await this.userService.validateUser(loginDto);

    if(!user || user === null){
        throw new UserNotFoundException();
    }
    console.log('validated user:', user);
    return user;
}
}