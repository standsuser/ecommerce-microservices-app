import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
export class UserNotFoundException extends RpcException{
    constructor(){
        super({
            status:HttpStatus.NOT_FOUND,
            error:'User not found'
        });
    }
}