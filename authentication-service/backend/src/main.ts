/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import cors from 'cors';

/*
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer:{
        groupId:'USER_SERVICE',
      }
    }
  })
  await app.listen();
  }
bootstrap();

*/


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorInterceptor());
  const cors = require("cors");


  const corsOptions = {
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: 'GET,POST,DELETE',              // Allow only GET and POST requests
    optionsSuccessStatus: 200,        // Respond with a 200 status for OPTIONS requests
    credentials: true                 // Allow credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));





 


  await app.listen(3000);
}
bootstrap();
