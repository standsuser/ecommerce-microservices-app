/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthGuard } from '../strategies/local-auth.guard';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { ExistsAuthGuard } from '../strategies/exists-auth.guard';
//import { Post } from '@nestjs/common';

@Controller()
export class UserController {
    constructor(private userService : UserService){}

    
//"@post"
// async register(@Request() req){
//     
//     return this.accountService.register({body:req.body});
// }

    @UseGuards(ExistsAuthGuard)
    
    @MessagePattern('register')
    async register(command){
        console.log(command);
        return this.userService.register(command.data);
    }
    @MessagePattern('forgot-password')
    async forgetPassword(command){
        return this.userService.forgetPassword(command.data);
    }
    @UseGuards(LocalAuthGuard)
    @MessagePattern('login')
    async login(command){
        console.log('command user: ', command.user);
        return this.userService.login({
            ...command.user,
            roles:['admin']
        }
        );
    }

    @UseGuards(LocalAuthGuard)
    @MessagePattern('logout')
    async logout(command){
        console.log('command user: ', command.user);
        return this.userService.logout({
            ...command.user,
            roles:['admin']
        }
        );
    }

    // @MessagePattern('change-password')
    // async changePassword(command){
    //     return this.userService.changePassword(command.userID,command.newPassword);
    // }



    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command){
        const {id , ...rest} =command.user;
        return rest;
    }

    @MessagePattern('isAutheticated')
    async isAutheticated(command){
       try{
        const res = this.userService.validateToken(command.jwt);
        return res;

       }
       catch(err){
        return false;
       }
    }

    

}
