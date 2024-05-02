

import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get('product/:productId')
    async getProductDetails(@Param('productId') productId: string) {
        return await this.catalogService.getProductDetails(productId);


 
    }

    @Get('category/:categoryId')
    async getCategoryDetails(@Param('categoryId') categoryId: string) {
        return await this.catalogService.getCategoryDetails(categoryId);
    }
    
}


