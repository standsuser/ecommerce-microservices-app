import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io'; // Change the import statement

import pmClient from 'payment-microservice-client';

async function bootstrap() {
  const expressApp = express();
  const server = http.createServer(expressApp);
  
  // Create Socket.io server instance
  const io = new socketIo.Server(server); 

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  pmClient({
    httpServer: server,
    httpPort: 3007, 
    socketServer: io,
    redisHost: 'localhost', // Redis server host
    redisPort: 6379,        // Redis server port
    clientName: 'TestClient',
    connectFn: socketConnect,
  });

  // Start the server
  const PORT = process.env.PORT || 3007;
  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

async function socketConnect(socket: any) {
  console.log('A user connected');

  // Example: Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
}

bootstrap();
