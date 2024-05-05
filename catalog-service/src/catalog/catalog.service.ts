import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from "../kafka/consumer.service";
import { FeaturedListing } from './schema/featuredlisting';
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
      { topics: ['featured'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const product = JSON.parse(message.value.toString());

          // Update the featured listing with the product info
          await this.featuredListingModel.updateOne({ productId: product.productId }, product, { upsert: true });
        },
      },
    );

    // Consume 'topoffer' topic
    await this.consumerService.consume(
      { topics: ['topoffer'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const offer = JSON.parse(message.value.toString());

          // Update the top offer with the offer info
          await this.topOfferModel.updateOne({ productId: offer.productId }, offer, { upsert: true });
        },
      },
    );
  }
}