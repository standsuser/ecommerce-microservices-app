/* eslint-disable prettier/prettier */

/* eslint-disable no-var */
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus
}from '@nestjs/common'
import { Observable,throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
function doException(err){
    console.log(err)
    try {
        if(err.status ==='error'){
            return new HttpException("Something went wrong",HttpStatus.BAD_GATEWAY);
        }else{
            var error = err.message;

            if(err.error){
                error= err.error;
            }
            if(err.response && err.response.error){
                error = err.response.error;
            }
            return new HttpException(error,err.status)
        }
    }catch {
        return new HttpException("Something went wrong",HttpStatus.BAD_GATEWAY);
         
    }
}
@Injectable()
export class ErrorInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(err =>{
                return throwError(doException(err));
            })
        );
    }
}