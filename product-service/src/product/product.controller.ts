import { Controller, Post, Body, Param, Patch, Delete, Get, UseInterceptors, ClassSerializerInterceptor, Req,  HttpException, HttpStatus  } from '@nestjs/common';
import { ProductService } from './product.service';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('favorites/:userId')
  async getFavorites(@Param('userId') userId: string) {
    return await this.productService.getFavorites(userId);
  }

  @Post('favorites')
  async addFavorite(@Body() body: { userId: string; productId: string }) {
    const { userId, productId } = body;
    return await this.productService.addFavorite(userId, productId);
  }

  @Get(':productId')
  async getProductDetails(@Param('productId') productId: string) {
    return await this.productService.getProductDetails(productId);
  }

  @Patch(':productId/customize')
  async customizeProduct(@Param('productId') productId: string, @Body() customizationOptions: any) {
    return await this.productService.customizeProduct(productId, customizationOptions);
  }

  @Post('wishlist')
  async addToWishlist(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('selectedColor') selectedColor: string,
    @Body('selectedMaterial') selectedMaterial: string,
    @Body('selectedSize') selectedSize: string,
  ) {    
  }

  @Post(':productId/share')
  async shareProduct(
    @Param('productId') productId: string,
    @Req() req: any,
  ) {
    return await this.productService.shareProduct(productId, req);
  } 


  

  @Get('search/:keyword')
  async searchKeyword(@Param('keyword') keyword: string) {
    return await this.productService.searchKeyword(keyword);
  }
}
