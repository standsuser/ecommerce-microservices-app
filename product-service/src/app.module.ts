import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './kafka/test.consumer';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    KafkaModule,
    ProductModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      connectionName: 'DatabaseConnection',
    }),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, TestConsumer, ProductService],
})
export class AppModule {}
