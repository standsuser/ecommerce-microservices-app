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
        
    try {
      const favorites = await this.favoriteModel.find({ userid: userId }).populate('productid').exec();
      if (!favorites) {
        throw new NotFoundException('Favorites not found');
      }
      return favorites;
    } catch (error) {
      throw new NotFoundException('Favorites not found');
    }
       // return await this.favoriteModel.find({ userid: userId }).populate('productid').exec()
      //return await favorite.save();
  }


  async addFavorite(userId: string, productId: string, selectedColor: string, selectedMaterial: string, selectedSize: string) {
        //const favorite = new this.favoriteModel({ userid: userId, productid: productId });

    try {
      await this.addToWishlist(userId, productId , selectedColor, selectedMaterial, selectedSize);
    } catch (error) {
      throw new NotFoundException('Product not found');

    }
    //return await favorite.save();
  }

  async removeFavorite(userId: string, productId: string) {
    try {
      const favorite = await this.favoriteModel.findOneAndDelete({ userid: userId, productid: productId });
      if (!favorite) {
        throw new NotFoundException('Favorite not found');
      }
      return favorite;

    } catch (error) {
      throw new NotFoundException('Favorite not found');
    }
    //return await this.favoriteModel.findOneAndDelete({ userid: userId, productid: productId });
  }





  async getProductDetails(productId: string) {
    

    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }  
    
    //return await this.productModel.findById(productId);
  }
  
  async customizeProduct(productId: string , size: string, color: string, material: string) {
    
    try {
      if (!productId ) {
        throw new Error('Invalid input parameters');
      }
  
      
      const updatedProduct = await this.productModel.findByIdAndUpdate(productId, { color, material, size }, { new: true });
  
      if (!updatedProduct) { 
        throw new NotFoundException('Product not found');
      }
  
      return updatedProduct;
    } catch (error) {
      throw new Error('Failed to customize product: ' + error.message);
    }
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

  // to do ma3a mariam insha'allah 
/*
  async shareProduct(productId: string, shareOptions: any) {
    try {
      if (!productId || !shareOptions) {
        throw new Error('Invalid input parameters');
      }

      const product = await this.product

      const event = {
        productId,
        shareOptions,
        eventType: 'ProductShared'
      };

      await producer.connect();

      await producer.send({
        topic: 'product-events',
        messages: [
          { value: JSON.stringify(event) }
        ]
      });

  }
*/
  async searchKeyword(keyword: string) {

    try {
      return await this.productModel.find({ $text: { $search: keyword } });
    }
    catch (error) {
      throw new NotFoundException('Product not found');
    }
    //return await this.productModel.find({ $text: { $search: keyword } });
  }



  //------------------------------------------------------REVIEW------------------------------------------------------

  async getProductReviews(productId: string) {
    try {
        const reviews = await this.productModel.find({ productid: productId }).exec();
        if (!reviews) {

            throw new NotFoundException('Reviews not found');
        }
        return reviews;
    } catch (error) {

        throw new NotFoundException('Reviews not found');
    }
}


async addReview(userId: string, productId: string, rating: number, review: string) {
    try {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const newReview = new this.productModel({ userid: userId, productid: productId, rating: rating, review: review });
        await newReview.save();
        return newReview;
    } catch (error) {
        throw new NotFoundException('Product not found');
    }
}
/*
async updateReview(userId: string, reviewId: string, rating: number, review: string) {
    try {
        const updatedReview = await this.productModel.findOneAndUpdate({ _id: reviewId, userid: userId }, { rating: rating, review: review }, { new: true }).exec();
        if (!updatedReview) {
            throw new NotFoundException('Review not found');
        }
        return updatedReview;
    } catch (error) {
        throw new NotFoundException('Review not found');
    }
}

async deleteReview(userId: string, reviewId: string) {
    try {
        const deletedReview = await this.productModel.findOneAndDelete({ _id: reviewId, userid: userId }).exec();
        if (!deletedReview) {
            throw new NotFoundException('Review not found');
        }
        return deletedReview;
    } catch (error) {
        throw new NotFoundException('Review not found');
    }
}

async getUserProductReview(userId: string, productId: string) {
    try {
        const review = await this.productModel.findOne({ userid: userId, productid: productId }).exec();
        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    } catch (error) {
        throw new NotFoundException('Review not found');
    }

  }

  async getUserReviews(userId: string) {
    try {
        const reviews = await this.productModel.find({ userid: userId }).exec();
        if (!reviews) {
            throw new NotFoundException('Reviews not found');
        }
        return reviews;
    } catch (error) {
        throw new NotFoundException('Reviews not found');
    }
  }

  async updateReview(reviewId: string, rating: number, review: string) {
    try {
        const updatedReview = await this.productModel.findByIdAndUpdate
        ({
            _id: reviewId
        },
        {
            rating,
            review
        },
        {

            new: true
        }).exec();
        if (!updatedReview) {
            throw new NotFoundException('Review not found');
        }
        return updatedReview;
    } catch (error) {
        throw new NotFoundException('Review not found');
    }
  }
  */

}
