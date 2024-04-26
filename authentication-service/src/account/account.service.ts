import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AccountService {
    constructor(@Inject('ACC_SERVICE') private readonly accountClient:ClientKafka){}


    public hello(){
        return this.accountClient.send('hellofromapi','hello from api').subscribe((data)=>console.log(''));
    }
    public register(command){
        return this.accountClient.send('register',command).subscribe((data)=>console.log(command.data));
    }
    public login(command){
        return this.accountClient.send('login',command).subscribe((data)=>console.log(command.data));
    }
    public me(command){
        return this.accountClient.send('me',command).subscribe((data)=>console.log(command.data));
    }
}
