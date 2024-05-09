import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { FeaturedListing, FeaturedListingSchema } from './schema/featuredlisting.schema';
import { Offer, TopOffer } from './schema/topoffer.schema';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FeaturedListing.name, schema: FeaturedListingSchema },
            { name: Offer.name, schema: TopOffer },
        ])
    ],
    controllers: [CatalogController],
    providers: [CatalogService, ConsumerService, ProducerService],
})
export class CatalogModule {}
