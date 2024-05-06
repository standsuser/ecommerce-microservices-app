/* eslint-disable prettier/prettier */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user.service";
import { LoginDto } from "../dto/login.dto";
import { UserAlreadyExistsException } from "../exceptions/userAlreadyExists.exception";

@Injectable()
export class ExistsStrategy extends PassportStrategy(Strategy, 'exists'){
constructor(private readonly identityService:UserService){
    super();
}
async validate(username:string, password:string):Promise<any>{
    console.log(username,password);

    var loginDto:LoginDto ={
        username,password
    }
    const user = await this.identityService.getUserbyUsername(username);

    if(!user||user !==null){
        throw new UserAlreadyExistsException();
    }
    return {
        username:username,
        pasword:password,
    };
}
}