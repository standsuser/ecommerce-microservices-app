/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ErrorInterceptor } from './interceptors/error.interceptor';
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

  // Enable CORS globally
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
