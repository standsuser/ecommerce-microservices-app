import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<User>,
        private jwtService:JwtService
        ) {}

    hello(message){
        return message;
    }

    async register(CreateUserDto:CreateUserDto){
        const createUser= new this.userModel(CreateUserDto)
        let saveResult = await createUser.save();
        console.log(saveResult)
        return saveResult;
    }

    async validateUser(loginDto:LoginDto){
        let loginResult =await this.userModel.findOne({
            username:loginDto.username,
            password:loginDto.password,
        });

        if(loginResult===null){
            return null;
        }
        
        let jsonData =loginResult.toObject();
        let {__v, _id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }

    async getUserbyUsername(username:string){
        let loginResult =await this.userModel.findOne({
            username:username,
           
        });

        if(loginResult===null){
            return null;
        }
        let jsonData =loginResult.toObject();
        let {__v, _id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }
    async login(user:any){
        //console.log(command)
        let payload = {
            id:user._id,
            name:user.name,
            username:user.username,
            roles:user.roles

        };
        
        var token =this.jwtService.sign(payload);
        var tokenvalue:any =this.jwtService.decode(token);
       

        return{
            access_token:token,
            expires_in:tokenvalue.exp,

        };
        
    }
    validateToken(jwt:string){
        const validatedToken = this.jwtService.sign(jwt);
        return validatedToken;
    }
}
