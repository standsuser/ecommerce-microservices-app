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
  Query
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { ProductModule } from './product.module';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

    //----------------------------CATEGORIES----------------------------------------------
    @Get('/category')
    async getCategories() {
      return await this.productService.getCategories();
    }
    @Get('/products/:categoryid')
    async getProductsByCategory(@Param('categoryid') categoryid: string) {
      return await this.productService.getProductsByCategory(categoryid);
    }

  @Get('/favorites/:userId') // checked in service file and it is correct insha'allah
  async getFavorites(@Param('userId') userId: string) {
    return await this.productService.getFavorites(userId);
  }

  @Get('/favorites/all')
  async getAllFavorites() {
    return await this.productService.getAllFavorites();
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
    const { userId, productId} =
      body;
    return await this.productService.addFavorite(
      userId,
      productId
    );
  }

  @Delete(':userId/:productId') // checked in service file and it is correct insha'allah
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.productService.removeFavorite(userId, productId);
  }

  @Get('/:productId') // checked in service file and it is correct insha'allah
  async getProductDetails(@Param('productId') productId: string) {
    return await this.productService.getProductDetails(productId);
  }

  @Get(':productId/customize')
  async customizeProduct(
    @Param('productId') productId: string,
    @Query('color') color: string,
    @Query('material') material: string,
    @Query('size') size: string,
  ) {
    return await this.productService.customizeProduct(
      productId,
      size,
      color,
      material,
    );
  }

  @Post('/wishlist/add/:userId/:productId')
  async addToWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('selectedColor') selectedColor: string,
    @Body('selectedMaterial') selectedMaterial: string,
    @Body('selectedSize') selectedSize: string,
  ) {
    return await this.productService.addToWishlist(
      userId,
      productId,
      selectedColor,
      selectedMaterial,
      selectedSize,
    );
  }

  // async shareProduct(@Param('productId') productId: string, @Body() shareOptions: any) {
  //   return await this.productService.shareProduct();
  // }

  @Get('search/:keyword') // checked in service file and it is correct insha'allah
  async searchKeyword(@Param('keyword') keyword: string) {
    return await this.productService.searchKeyword(keyword);
  }

  // -----------------------------------------------------REVIEW-----------------------------------------------------

  @Get('/review/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return await this.productService.getProductReviews(productId);
  }

  @Post('/review/add/:productId/:userId')
  async addReview(
    @Param('productId') productId: string,
    @Param('userId') userId: string,
    @Body() body: { rating: number; review: string },
  ) {
    const { rating, review } = body;
    return await this.productService.addReview(
      productId,
      userId,
      rating,
      review,
    );
  }


  @Delete('/review/delete/:userId/:reviewId')
  async deleteMyReview(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    return this.productService.deleteMyReview(userId, reviewId);
  }

  @Patch('/review/update/:userId/:reviewId')
  async updateMyReview(
    @Param('userId') userId: string,
    @Param('reviewId') reviewId: string,
    @Body('rating') rating: number,
    @Body('review') review: string
  ) {
    return this.productService.updateMyReview(userId, reviewId, rating, review);
  }

  @Get('/myreviews/:userId')
  async getMyReviews(@Param('userId') userId: string) {
    return this.productService.getMyReviews(userId);
  }

}
