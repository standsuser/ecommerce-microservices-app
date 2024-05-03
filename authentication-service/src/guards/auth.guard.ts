/* eslint-disable prettier/prettier */
import { CanActivate,ExecutionContext,Logger,Inject } from "@nestjs/common";
import { ClientKafka} from "@nestjs/microservices";
//import { Observable } from "rxjs";
import {timeout} from 'rxjs/operators'
import { AppService } from "src/app.service";

export class AuthGuard implements CanActivate{
    constructor(private accountServices:AppService,
        @Inject('USER_SERVICE') private readonly Client:ClientKafka){

        }
        async canActivate(context: ExecutionContext): Promise<boolean>  {
            const req = context.switchToHttp().getRequest();

            try{
                const isAuthenticated = await this.Client.send<boolean>('isAutheticated',
                    
                    {
                        jwt: req.headers.authorization?.split(' ')[1]
                    }
                ).pipe(timeout(5000)).toPromise();
                if(isAuthenticated &&isAuthenticated !== null){
                    req.user = isAuthenticated;
                    return true;
                }
                else{
                    return false;
                }
            }catch(err){
                Logger.error(err);
                console.log(err);
                return false;

            }

        } 
    }
   