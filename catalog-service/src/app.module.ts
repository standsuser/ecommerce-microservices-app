import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './kafka/test.consumer';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { FeaturedListing, FeaturedListingSchema } from './catalog/schema/featuredlisting.schema';
import { Offer, TopOffer } from './catalog/schema/topoffer.schema';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: FeaturedListing.name, schema: FeaturedListingSchema },
      { name: Offer.name, schema: TopOffer },
    ]),
  ],
  controllers: [AppController, CatalogController],
  providers: [AppService, TestConsumer, CatalogService],
})
export class AppModule {}