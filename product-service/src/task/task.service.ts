import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { ProductService } from '../product/product.service';

@Injectable()
export class TaskService implements OnModuleInit {
    constructor(private readonly productService: ProductService) { }

    onModuleInit() {
        console.log('onModuleInit called');
        cron.schedule('* * * * *', async () => { // This will run every minute
            try {
                console.log('Running cron job');
                await this.productService.sendTopDiscountedProducts();
                await this.productService.sendTopRatedProducts();
                console.log('Finished cron job');
            } catch (error) {
                console.error('Error in cron job:', error);
            }
        });
    }
}
