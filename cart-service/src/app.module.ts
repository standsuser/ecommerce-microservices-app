import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CartModule,
    MongooseModule.forRoot('mongodb://localhost:27018/cart'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

