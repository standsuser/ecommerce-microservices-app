import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5050', // Update with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS
//   app.enableCors({
//     origin: 'http://localhost:5050', // Allow only this origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
//     credentials: true, // Allow credentials
//   });

//   // Use global validation pipe (optional)
//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(3001);
//   console.log(`Application is running on: ${await app.getUrl()}`);
// }
// bootstrap();
