import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller'; 
import { ProductService } from './product.service'; 
import { Product, ProductSchema } from './schema/product.schema'; 
import { Favorite, FavoriteSchema } from './schema/favorite.schema'; 
import { Category, CategorySchema } from './schema/category.schema'; 
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Favorite.name, schema: FavoriteSchema }, 
            { name: Category.name, schema: CategorySchema },
        ]),
    ],
    controllers: [ProductController],
    providers: [ProductService, ConsumerService, ProducerService],
})
export class ProductModule {}