

/*
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schema/review.schema';
//import { Product } from './schema/product.schema';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    brokers: ['localhost:9092'] // Update with your Kafka broker(s) address
});

const producer = kafka.producer();

@Injectable()
export class ReviewService {







    constructor(
        @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) {}

    async getReviews(productId: string) {
        try {
            const reviews = await this.reviewModel.find({ productid: productId }).exec();
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
            const newReview = new this.reviewModel({ userid: userId, productid: productId, rating: rating, review: review });
            await newReview.save();
            return newReview;
        } catch (error) {
            throw new NotFoundException('Product not found');
        }
    }

    async updateReview(userId: string, reviewId: string, rating: number, review: string) {
        try {
            const updatedReview = await this.reviewModel.findOneAndUpdate({ _id: reviewId, userid: userId }, { rating: rating, review: review }, { new: true }).exec();
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
            const deletedReview = await this.reviewModel.findOneAndDelete({ _id: reviewId, userid: userId }).exec();
            if (!deletedReview) {
                throw new NotFoundException('Review not found');
            }
            return deletedReview;
        } catch (error) {
            throw new NotFoundException('Review not found');
        }
    }
}
*/










































