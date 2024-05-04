import { Injectable, NotFoundException , Req,  HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Favorite } from './schema/favorite.schema';
import { Category } from './schema/category.schema';
import { ProducerService } from '../kafka/producer.service';

import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'] // Update with your Kafka broker(s) address
});

const socialSharingUtils = require('social-sharing-utilities');

const producer = kafka.producer();

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Favorite>,
    private readonly producerService: ProducerService,
  ) {}

  async sendTopDiscountedProducts() {
    // Query the top 5 highest discounted products
    const products = await this.productModel
      .find()
      .sort({ discountpercentage: -1 })
      .limit(5)
      .exec();

    // Prepare the record for Kafka
    const record = {
      topic: 'topoffer',
      messages: products.map((product) => ({
        value: JSON.stringify(product),
      })),
    };

    // Send the record to Kafka
    await this.producerService.produce(record);
  }

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

  async shareProduct( productId: string, @Req() req: any) {
    try {
      // Get base URL dynamically
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // generate the product URL
      const productUrl = `${baseUrl}/products/${productId}`;
      const text = 'Check out this link';

      const facebookShareUrl = socialSharingUtils.shareOnFacebook(productUrl);
      console.log('Share on Facebook:', facebookShareUrl);

      const twitterShareUrl = socialSharingUtils.shareOnTwitter(productUrl, text);
      console.log('Share on Twitter:', twitterShareUrl);
      return { 
        message: 'Product shared successfully',
        facebookShareUrl,
        twitterShareUrl
      };
  } catch (error) {
    throw new HttpException('Failed to share product', HttpStatus.INTERNAL_SERVER_ERROR);
  }  }

  async searchKeyword(keyword: string) {

    try {
      return await this.productModel.find({ $text: { $search: keyword } });
    }
    catch (error) {
      throw new NotFoundException('Product not found');
    }
    //return await this.productModel.find({ $text: { $search: keyword } });
  }

  calculateTotalPrice(productId: string, size: string, color: string , material: string , totalPrice: number): void {
    const product = this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Define prices for different sizes and colors (you can adjust these values as needed)
    const sizePrices = {
      'small': 5,
      'medium': 10,
      'large': 15
      // Add prices for other sizes as needed
    };

    const colorPrices = {
      'red': 2,
      'blue': 3,
      'green': 4,
      'black': 5,
      'white': 6
      // Add prices for other colors as needed
    };

    const   materialPrices = {
      'cotton': 10,
      'silk': 20,
      'wool': 30,
      'plastice': 40,
      // Add prices for other materials as needed
    };


    // Calculate total price based on size and color
    let sizePrice = sizePrices[size] || 0; // Default to 0 if size not found
    let colorPrice = colorPrices[color] || 0; // Default to 0 if color not found
    let materialPrice = materialPrices[material] || 0; // Default to 0 if base price not found

    // Update total price of the product
    product[totalPrice] = materialPrice + sizePrice + colorPrice;

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

        //calculate the new product rating
        const totalRating = product.totalRating + rating;
        const totalReviews = product.totalReviews + 1;
        const newRating = totalRating / totalReviews;
        await this.productModel.findByIdAndUpdate
        (productId, { rating: newRating, totalRating: totalRating, totalReviews: totalReviews }, { new: true }).exec();

        return newReview;
    } catch (error) {
        throw new NotFoundException('Product not found');
    }
}

//----------------------CATEGORIES-----------------------------------------


async getCategories() {
  try {
    const categories = await this.categoryModel.find().exec();
    if (!categories) {
      throw new NotFoundException('Categories not found');
    }
    return categories;
  } catch (error) {
    throw new NotFoundException('Categories not found');
  }
}



async getProductsByCategory(categoryid: string) {
  try {
    const products = await this.productModel.find({ categoryid }).exec();
    if (!products) {
      throw new NotFoundException('Products not found');
    }
    return products;
  } catch (error) {
    throw new NotFoundException('Products not found');
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
