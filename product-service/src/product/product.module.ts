import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '../kafka/kafka.module'; // Update this path to the actual path of the Kafka module
import { ProductController } from './product.controller'; 
import { ProductService } from './product.service'; 
import { Product, ProductSchema } from './schema/product.schema'; 
import { Favorite, FavoriteSchema } from './schema/favorite.schema'; 
import { Category, CategorySchema } from './schema/category.schema'; 

@Module({
    imports: [
        KafkaModule, // Add this line
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Favorite.name, schema: FavoriteSchema }, 
            { name: Category.name, schema: CategorySchema },
        ])
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}