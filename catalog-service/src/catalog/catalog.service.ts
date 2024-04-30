

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Catalog } from './schema/catalog.schema';
import { ProductCatalog } from './schema/product-catalog.schema';
import { Category } from './schema/category.schema';
import { Product } from './schema/product.schema';


@Injectable()
export class CatalogService {



    constructor(
        @InjectModel(Catalog.name) private readonly catalogModel: Model<Catalog>,
        @InjectModel(ProductCatalog.name) private readonly productCatalogModel: Model<ProductCatalog>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) {}

    async getCatalogs() {
        return await this.catalogModel.find().exec();
    }

    async getCatalog(catalogId: string) {
        return await this.catalogModel.findById(catalogId).exec();
    }

    async getCategories(catalogId: string) {
        return await this.categoryModel.find({ catalogid: catalogId }).exec();
    }

    async getCategory(categoryId: string) {
        return await this.categoryModel.findById(categoryId).exec();
    }

    async getProducts(categoryId: string) {
        return await this.productModel.find({ categoryid: categoryId }).exec();
    }

    async getProduct(productId: string) {
        return await this.productModel.findById(productId).
        populate('categoryid').exec();
    }

    async addCatalog(name: string, description: string) {



        const newCatalog = new this.catalogModel({ name, description });
        await newCatalog.save();
        return newCatalog;
    }

    async addCategory(catalogId: string, name: string, description: string) {
        const newCategory = new this.categoryModel({ catalogid: catalogId, name, description });
        await newCategory.save();
        return newCategory;
    }

    async addProduct(categoryId: string, name: string, description: string, price: number) {
        const newProduct = new this.productModel({ categoryid: categoryId, name, description, price });
        await newProduct.save();
        return newProduct;
    }

    async updateCatalog(catalogId: string, name: string, description: string) {
        const updatedCatalog = await this.catalogModel.findByIdAndUpdate
        (catalogId, { name, description }, { new: true }).exec();
        return updatedCatalog;
    }

    async updateCategory(categoryId: string, name: string, description: string) {
        const updatedCategory = await this.categoryModel.findByIdAndUpdate
        (categoryId, { name, description }, { new: true }).exec();
        return updatedCategory;
    }


    async updateProduct(productId: string, name: string, description: string, price: number) {
        const updatedProduct = await this.productModel.findByIdAndUpdate
        (productId, { name, description, price }, { new: true }).exec();
        return updatedProduct;
    }

    async deleteCatalog(catalogId: string) {
        const deletedCatalog = await this.catalogModel.findById
        AndDelete(catalogId).exec();

        return deletedCatalog;
    }

    async deleteCategory(categoryId: string) {
        const deletedCategory = await this.categoryModel.findById
        AndDelete(categoryId).exec();

        return deletedCategory;
    }

    async deleteProduct(productId: string) {
        const deletedProduct = await this.productModel.findById
        AndDelete(productId).exec();

        return deletedProduct;
    }
}

