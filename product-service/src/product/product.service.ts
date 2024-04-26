import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Favorite } from './schema/favorite.schema';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'] // Update with your Kafka broker(s) address
});

const producer = kafka.producer();

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
  ) {}

  async getFavorites(userId: string) {
    return await this.favoriteModel.find({ userid: userId }).populate('productid').exec();
  }

  async addFavorite(userId: string, productId: string) {
    const favorite = new this.favoriteModel({ userid: userId, productid: productId });
    return await favorite.save();
  }

  async getProductDetails(productId: string) {
    return await this.productModel.findById(productId);
  }

  async customizeProduct(productId: string, customizationOptions: any) {
    return await this.productModel.findByIdAndUpdate(productId, customizationOptions, { new: true });
  }

    async addToWishlist(userId: string, productId: string, selectedColor: string, selectedMaterial: string, selectedSize: string) {
        try {
        await producer.connect();

        const event = {
            userId,
            productId,
            selectedColor,
            selectedMaterial,
            selectedSize,
            eventType: 'WishlistItemAdded'
        };

        await producer.send({
            topic: 'wishlist-events',
            messages: [
            { value: JSON.stringify(event) }
            ]
        });

        console.log('Event published successfully:', event);
        } catch (error) {
        console.error('Error publishing event:', error);
        } finally {
        await producer.disconnect();
        }
    }
  

  async shareProduct(productId: string, shareOptions: any) {
    // Implement logic to share product
  }

  async searchKeyword(keyword: string) {
    return await this.productModel.find({ $text: { $search: keyword } });
  }
}
