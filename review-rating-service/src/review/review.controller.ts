
/*


import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { get } from 'http';

@Controller('review')



export class ReviewController {



    constructor(private readonly reviewService: ReviewService) {}

    
    @Get('product/:productId') 
    async getProductReviews(@Param('productId') productId: string) {
        return await this.reviewService.getProductReviews(productId);
    }

    @Post('product/:productId') 
    async addReview(@Param('productId') productId: string, @Body() body: { userId: string, rating: number, review: string }) {
        const { userId, rating, review } = body;
        return await this.reviewService.addReview(productId, userId, rating, review);
    }

    @Delete(':reviewId') 
    async deleteReview(@Param('reviewId') reviewId: string) {
        return await this.reviewService.deleteReview(reviewId);
    }

    @Put(':reviewId')
    async updateReview(@Param('reviewId') reviewId: string, @Body() body: { rating: number, review: string }) {

        const { rating, review } = body;
        return await this.reviewService.updateReview(reviewId, rating, review);
    }

    @Get('user/:userId') 
    async getUserReviews(@Param('userId') userId: string) {
        return await this.reviewService.getUserReviews(userId);
    }

    @Get('user/:userId/product/:productId') 
    async getUserProductReview(@Param('userId') userId: string, @Param('productId') productId: string) {
        return await this.reviewService.getUserProductReview(userId, productId);
    }



    


}   

*/