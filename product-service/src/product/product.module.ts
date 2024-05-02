import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller'; 
import { ProductService } from './product.service'; 
import { Product, ProductSchema } from './schema/product.schema'; 

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]) // Update the reference to Product
    ],
    controllers: [ProductController], // Update the controller
    providers: [ProductService], // Update the service
})
export class ProductModule {} // Rename the class
