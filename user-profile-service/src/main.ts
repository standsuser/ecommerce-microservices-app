/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require("cors");



  const corsOptions = {
    origin: 'http://localhost:5050', // Allow requests from this origin
    methods: 'GET,POST,DELETE,PATCH',              // Allow only GET and POST requests
    optionsSuccessStatus: 200,        // Respond with a 200 status for OPTIONS requests
    credentials: true                 // Allow credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));

  await app.listen(3003);
}
bootstrap();
