/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('featured')
  getFeaturedListings() {
    return this.catalogService.getFeaturedListings();
  }

  @Get('topoffers')
  getTopOffers() {
    return this.catalogService.getTopOffers();
  }
}