import { CatalogService } from './catalog.service';
import { Controller, Post, Body, Get, Param } from '@nestjs/common';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  async addToWishlist(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('selectedColor') selectedColor: string,
    @Body('selectedMaterial') selectedMaterial: string,
    @Body('selectedSize') selectedSize: string,
  ) {
    await this.catalogService.addToWishlist(
      userId,
      productId,
      selectedColor,
      selectedMaterial,
      selectedSize,
    );
    return { message: 'Wishlist item added successfully' };
  }

//   @Get('/featured')
//   async getFeaturedProducts() {
//     return await this.catalogService.getFeaturedProducts();
//   }

  @Get('/topOffers')
  async getTopOffers() {
    return await this.catalogService.getTopOffers();
  }


}
