import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
export class UserAlreadyExistsException extends RpcException{
    constructor(){
        super({
            status:HttpStatus.BAD_REQUEST,
            error:'User already exists'
        });
    }
}