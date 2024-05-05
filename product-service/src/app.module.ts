import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './kafka/test.consumer';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { Product } from './product/schema/product.schema';
import { Favorite } from './product/schema/favorite.schema';
import { Category } from './product/schema/category.schema';
import { Review } from './product/schema/review.schema';
@Module({
  imports: [KafkaModule, Product, Favorite, Category, Review],
  controllers: [AppController, ProductController],
  providers: [AppService, TestConsumer, ProductService],
})
export class AppModule {}
