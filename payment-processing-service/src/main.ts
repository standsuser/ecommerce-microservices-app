import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5050', // Replace with your frontend URL
    credentials: true,
  });
  await app.listen(3010);
}
bootstrap();