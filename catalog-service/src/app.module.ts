import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './kafka/test.consumer';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { FeaturedListing } from './catalog/schema/featuredlisting';
import { Offer } from './catalog/schema/topoffer.schema';
@Module({
  imports: [KafkaModule, FeaturedListing, Offer],
  controllers: [AppController, CatalogController],
  providers: [AppService, TestConsumer, CatalogService],
})
export class AppModule {}