import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  ClassSerializerInterceptor,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { ProductModule } from './product.module';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('favorites/:userId') // checked in service file and it is correct insha'allah
  async getFavorites(@Param('userId') userId: string) {
    return await this.productService.getFavorites(userId);
  }

  @Post('favorites') // check and it is correct insha'allah
  async addFavorite(
    @Body()
    body: {
      userId: string;
      productId: string;
      selectedColor: string;
      selectedMaterial: string;
      selectedSize: string;
    },
  ) {
    const { userId, productId, selectedColor, selectedMaterial, selectedSize } =
      body;
    return await this.productService.addFavorite(
      userId,
      productId,
      selectedColor,
      selectedMaterial,
      selectedSize,
    );
  }

  @Delete(':userId/:productId') // checked in service file and it is correct insha'allah
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.productService.removeFavorite(userId, productId);
  }

  @Get(':productId') // checked in service file and it is correct insha'allah
  async getProductDetails(@Param('productId') productId: string) {
    return await this.productService.getProductDetails(productId);
  }

  @Patch(':productId/customize') // checked in service file and it is correct insha'allah
  async customizeProduct(
    @Param('productId') productId: string,
    @Body() { color, material, size },
  ) {
    return await this.productService.customizeProduct(
      productId,
      color,
      material,
      size,
    );
  }

  @Post('wishlist')
  async addToWishlist(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('selectedColor') selectedColor: string,
    @Body('selectedMaterial') selectedMaterial: string,
    @Body('selectedSize') selectedSize: string,
  ) {}

  // async shareProduct(@Param('productId') productId: string, @Body() shareOptions: any) {
  //   return await this.productService.shareProduct();
  // }

  @Get('search/:keyword') // checked in service file and it is correct insha'allah
  async searchKeyword(@Param('keyword') keyword: string) {
    return await this.productService.searchKeyword(keyword);
  }

  // -----------------------------------------------------REVIEW-----------------------------------------------------

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return await this.productService.getProductReviews(productId);
  }

  @Post('product/:productId')
  async addReview(
    @Param('productId') productId: string,
    @Body() body: { userId: string; rating: number; review: string },
  ) {
    const { userId, rating, review } = body;
    return await this.productService.addReview(
      productId,
      userId,
      rating,
      review,
    );
  }

  //----------------------------CATEGORIES----------------------------------------------
  @Get('/categories')
  async getCategories() {
    return await this.productService.getCategories();
  }
  @Get('/products/:categoryid')
  async getProductsByCategory(@Param('categoryid') categoryid: string) {
    return await this.productService.getProductsByCategory(categoryid);
  }

  /*
  @Delete(':reviewId') 
  async deleteReview(@Param('reviewId') reviewId: string) {
      return await this.productService.deleteReview(reviewId);
  }

  @Put(':reviewId')
  async updateReview(@Param('reviewId') reviewId: string, @Body() body: { rating: number, review: string }) {

      const { rating, review } = body;
      return await this.productService.updateReview(reviewId, rating, review);
  }

  @Get('user/:userId') 
  async getUserReviews(@Param('userId') userId: string) {
      return await this.productService.getUserReviews(userId);
  }

  @Get('user/:userId/product/:productId') 
  async getUserProductReview(@Param('userId') userId: string, @Param('productId') productId: string) {
      return await this.productService.getUserProductReview(userId, productId);
  }
*/
}
