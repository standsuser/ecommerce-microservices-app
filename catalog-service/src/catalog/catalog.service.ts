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
    // Consume 'featured' and 'topoffer' topics
    await this.consumerService.consume(
        { topics: ['featured', 'topoffer'] },
        {
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    console.log(`Received message from ${topic} topic:`, data);

                    // Update the appropriate model based on the topic
                    if (topic === 'featured') {
                        await this.featuredListingModel.updateOne({ productId: data.productId }, data, { upsert: true });
                    } else if (topic === 'topoffer') {
                      await this.topOfferModel.updateOne(
                        { productId: data.productId },
                        { 
                            $set: {
                                ...data,
                                discountpercentage: data.discountpercentage 
                            } 
                        },
                        { upsert: true })
                      }
                } catch (error) {
                    console.error(`Error processing message from ${topic} topic:`, error);
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