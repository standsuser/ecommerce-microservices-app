/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { ProducerService } from 'src/kafka/producer.service';
@Module({
  imports: [
    CatalogModule,
    MongooseModule.forRoot('mongodb://localhost:27018/catalog'),
  ],
  controllers: [AppController],
  providers: [AppService, ProducerService],
})
export class AppModule {}