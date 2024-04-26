import { Controller, Request,Get, Inject, OnModuleInit, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('account')
export class AccountController implements OnModuleInit {

    constructor(private accountServices:AccountService,
        @Inject('ACC_SERVICE') private readonly accountClient:ClientKafka){}
   

    @Get('hello')
    getHello():any{
        return this.accountServices.hello();
    }

    @Post('sign-up')
    async regster(@Request()req){
        return this.accountServices.register({body:req.body.data});
    }

    @Post('sign-in')
    async login(@Request()req){
        return this.accountServices.login({body:req.body.data});
    }
    @UseGuards(AuthGuard)
    @Get('me')
    async me(@Request()req){
        return this.accountServices.me({headers:req.headers});
    }

    onModuleInit() {
        this.accountClient.subscribeToResponseOf('hellofromapi');
        this.accountClient.subscribeToResponseOf('register');
        this.accountClient.subscribeToResponseOf('login');
        this.accountClient.subscribeToResponseOf('me');
    }

}
