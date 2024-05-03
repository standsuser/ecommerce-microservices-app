

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Catalog } from './schema/catalog.schema';
// import { ProductCatalog } from './schema/product-catalog.schema';
// import { Category } from './schema/category.schema';
// import { Product } from './schema/product.schema';


// @Injectable()
// export class CatalogService {



//     constructor(
//         @InjectModel(Catalog.name) private readonly catalogModel: Model<Catalog>,
//         @InjectModel(ProductCatalog.name) private readonly productCatalogModel: Model<ProductCatalog>,
//         @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
//         @InjectModel(Product.name) private readonly productModel: Model<Product>,
//     ) {}

//     async getCatalogs() {
//         return await this.catalogModel.find().exec();
//     }

//     async getCatalog(catalogId: string) {
//         return await this.catalogModel.findById(catalogId).exec();
//     }

//     async getCategories(catalogId: string) {
//         return await this.categoryModel.find({ catalogid: catalogId }).exec();
//     }

//     async getCategory(categoryId: string) {
//         return await this.categoryModel.findById(categoryId).exec();
//     }

//     async getProducts(categoryId: string) {
//         return await this.productModel.find({ categoryid: categoryId }).exec();
//     }

//     async getProduct(productId: string) {
//         return await this.productModel.findById(productId).
//         populate('categoryid').exec();
//     }

//     async addCatalog(name: string, description: string) {



//         const newCatalog = new this.catalogModel({ name, description });
//         await newCatalog.save();
//         return newCatalog;
//     }

//     async addCategory(catalogId: string, name: string, description: string) {
//         const newCategory = new this.categoryModel({ catalogid: catalogId, name, description });
//         await newCategory.save();
//         return newCategory;
//     }

//     async addProduct(categoryId: string, name: string, description: string, price: number) {
//         const newProduct = new this.productModel({ categoryid: categoryId, name, description, price });
//         await newProduct.save();
//         return newProduct;
//     }

//     async updateCatalog(catalogId: string, name: string, description: string) {
//         const updatedCatalog = await this.catalogModel.findByIdAndUpdate
//         (catalogId, { name, description }, { new: true }).exec();
//         return updatedCatalog;
//     }

//     async updateCategory(categoryId: string, name: string, description: string) {
//         const updatedCategory = await this.categoryModel.findByIdAndUpdate
//         (categoryId, { name, description }, { new: true }).exec();
//         return updatedCategory;
//     }


//     async updateProduct(productId: string, name: string, description: string, price: number) {
//         const updatedProduct = await this.productModel.findByIdAndUpdate
//         (productId, { name, description, price }, { new: true }).exec();
//         return updatedProduct;
//     }

//     async deleteCatalog(catalogId: string) {
//         const deletedCatalog = await this.catalogModel.findById
//         AndDelete(catalogId).exec();

//         return deletedCatalog;
//     }

//     async deleteCategory(categoryId: string) {
//         const deletedCategory = await this.categoryModel.findById
//         AndDelete(categoryId).exec();

//         return deletedCategory;
//     }

//     async deleteProduct(productId: string) {
//         const deletedProduct = await this.productModel.findById
//         AndDelete(productId).exec();

//         return deletedProduct;
//     }
// }

// kafka.service.ts
import { Kafka, Producer, Consumer } from 'kafkajs';
import { FeaturedListing } from './schema/featuredlisting';
import { Injectable, NotFoundException , Req,  HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CatalogService {
  private kafka: Kafka;
  private producer: Producer;
private consumer: Consumer;

constructor(
    @InjectModel('FeaturedListing') private readonly featuredListingModel: Model<FeaturedListing>,
) {
    this.kafka = new Kafka({
        clientId: 'nest-kafka-producer',
        brokers: ['kafka:9092'],
    });
    this.producer = this.kafka.producer();

    async function runConsumer() {
        await this.consumer.connect();

        await this.consumer.subscribe({ topic: 'product-events' });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());

                if (event.eventType === 'ProductInfoReceived') {
                    // Process the received product info

                }
            },
        });
    }

}




  async addToWishlist(userId: string, productId: string, selectedColor: string, selectedMaterial: string, selectedSize: string) {
    try {
      await this.producer.connect();

      const event = {
        userId,
        productId,
        selectedColor,
        selectedMaterial,
        selectedSize,
        eventType: 'WishlistItemAdded'
      };

      await this.producer.send({
        topic: 'wishlist-events',
        messages: [
          { value: JSON.stringify(event) }
        ]
      });

      console.log('Event published successfully:', event);
    } catch (error) {
      console.error('Error publishing event:', error);
    } finally {
      await this.producer.disconnect();
    }
  }

// async getFeaturedProducts() {
//     try {
//         // Read the featurelisting document from MongoDB
//         const featureListing = await this.featuredListingModel.findOne().exec();

//         // Publish an event requesting product info from the product-service
//         await this.producer.connect();

//         const event = {
//             featureListingId: featureListing._id,
//             eventType: 'GetProductInfo'
//         };

//         await this.producer.send({
//             topic: 'product-events',
//             messages: [
//                 { value: JSON.stringify(event) }
//             ]
//         });

//         console.log('Event published successfully:', event);

//         // Receive the rest of the product info from the product-service
//         const productInfo = await this.consumer.receiveProductInfo();

//         // Return the product info
//         return productInfo;
//     } catch (error) {
//         console.error('Error getting featured products:', error);
//     } finally {
//         await this.producer.disconnect();
//     }
// }


    async getTopOffers() {
        // Logic to get top offers
    }

}