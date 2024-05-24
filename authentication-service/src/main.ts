/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ErrorInterceptor } from './interceptors/error.interceptor';
//import * as dotenv from 'dotenv'
//dotenv.config()


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
 // require("dotenv").config();



  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorInterceptor());
  const cors = require("cors");



  const corsOptions = {
    origin: 'http://localhost:5050', // Allow requests from this origin
    methods: 'GET,POST,DELETE,PUT',              // Allow only GET and POST requests
    optionsSuccessStatus: 200,        // Respond with a 200 status for OPTIONS requests
    credentials: true                 // Allow credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));





  await app.listen(3080);
}
bootstrap();
