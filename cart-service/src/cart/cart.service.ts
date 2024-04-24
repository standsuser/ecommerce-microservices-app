import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { AddCartItemDto } from './dto/addcartitem.dto';
import { UpdateCartItemDto } from'./dto/updatecartitem.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>) {}

    async addItemToCart(userId: string, addItemDto: AddCartItemDto): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userId }).exec();
        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === addItemDto.productId);
        if (existingItemIndex !== -1) {
            // Item already exists in cart, update quantity
            cart.items[existingItemIndex].quantity += addItemDto.quantity;
        } else {
            // Item doesn't exist in cart, add new item
            cart.items.push({ productId: addItemDto.productId, quantity: addItemDto.quantity });
            // At front end, update quantity to ensure that the person buying can pick the amount, otherwise set the quantity to 1
        }

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async updateCartItem(userId: string, productId: string, updateItemDto: UpdateCartItemDto): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        
        const existingItem = cart.items.find(item => item.productId === productId);
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (updateItemDto.quantity !== undefined) {
            if (updateItemDto.quantity === 0) {
                // If quantity is zero, remove the item from the cart
                cart.items = cart.items.filter(item => item.productId !== productId);
            } else {
                existingItem.quantity = updateItemDto.quantity;
            }
        }
        

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);

        cart.items = cart.items.filter(item => item.productId !== productId);

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async applyCouponCode(userId: string, couponCode: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        cart.couponCode = couponCode; // Assume coupon code validation is handled elsewhere

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    } //recheck this later

    async proceedToCheckout(userId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        cart.isCheckout = true;

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async getCartDetails(userId: string): Promise<Cart> {
        return await this.getCartByUserId(userId);
    }

    private async getCartByUserId(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId }).exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }
}
