import { CanActivate,ExecutionContext,Logger,Inject, OnModuleInit } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {timeout} from 'rxjs/operators'
import { AccountService } from "src/account/account.service";

export class RolesGuard implements CanActivate{
    constructor(private accountServices:AccountService,
        @Inject('ACC_SERVICE') private readonly Client:ClientKafka,
        private readonly reflector:Reflector){

        }

        async canActivate(context: ExecutionContext): Promise<boolean>  {
            const req = context.switchToHttp().getRequest();

            try{

                const roles = this.reflector.get<string[]>('roles',context.getHandler());
                console.log('checkingroles',roles)
                if(!roles || !roles.length){
                    return true;
                }


                const user = await this.Client.send<any>( 'me',
                    
                    {
                        headers:req.headers       
                    }
                ).pipe(timeout(5000)).toPromise();
                console.log('user',user)

                const userRoles = user.roles;
                console.log('userRoles',userRoles)

               return userRoles.includes('any') || userRoles.some(role => roles.includes(role));
                
            }catch(err){
                Logger.error(err);
                console.log('userRoles:',err);
                return false;

            }

        } 
    }
   