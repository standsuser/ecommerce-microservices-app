import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from "../kafka/consumer.service";
import { FeaturedListing } from './schema/featuredlisting.schema';
import { Offer } from './schema/topoffer.schema';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    @InjectModel(FeaturedListing.name) private readonly featuredListingModel: Model<FeaturedListing>,
    @InjectModel(Offer.name) private readonly topOfferModel: Model<Offer>,
  ) {}

  async onModuleInit() {
    // Consume 'featured' topic
    await this.consumerService.consume(
      { topics: ['featured'] , fromBeginning: true },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const product = JSON.parse(message.value.toString());
            console.log('Received message from featured topic:', product);

            // Update the featured listing with the product info
            await this.featuredListingModel.updateOne({ productId: product.productId }, product, { upsert: true });
          } catch (error) {
            console.error('Error processing message from featured topic:', error);
          }
        },
      },
    );

    // Consume 'topoffer' topic
    await this.consumerService.consume(
      { topics: ['topoffer'] , fromBeginning: true },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const offer = JSON.parse(message.value.toString());
            console.log('AAAAA Received message from topoffer topic:', offer);

            // Update the top offer with the offer info
            await this.topOfferModel.updateOne({ productId: offer.productId }, offer, { upsert: true });
          } catch (error) {
            console.error('Error processing message from topoffer topic:', error);
          }
        },
      },
    );
  }

  async getFeaturedListings() {
    return this.featuredListingModel.find().exec();
  }

  async getTopOffers() {
    return this.topOfferModel.find().exec();
  }
}