import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { ProductService } from '../product/product.service';

@Injectable()
export class TaskService implements OnModuleInit {
    constructor(private readonly productService: ProductService) {}

    onModuleInit() {
        cron.schedule('0 * * * *', () => { // This will run every hour
            this.productService.sendTopDiscountedProducts();
            this.productService.sendTopRatedProducts();
        });
    }
}
