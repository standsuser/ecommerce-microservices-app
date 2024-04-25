import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/product.schema';
import { Coupon, CouponDocument }  from './schema/favorite.schema';
import { AddCartItemDto } from './dto/addcartitem.dto';
import { UpdateCartItemDto } from'./dto/updatecartitem.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
        @InjectModel('Coupon') private readonly couponModel: Model<CouponDocument>) {}


    async addItemToCart(userId: string, addItemDto: AddCartItemDto): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);

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
    async addItemToCartGuest(addItemDto: AddCartItemDto, sessionId: string): Promise<Cart> {
        let cart = await this.getCartBySessionId(sessionId);
        if (!cart) {
            cart = new this.cartModel({ sessionId, items: [] });
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

        const existingItem = cart.items.find(item => item.productId === productId); //TODO: check if productId is named properly
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (updateItemDto.quantity !== undefined) {
            if (updateItemDto.quantity === 0) {
                // If quantity is zero, remove the item from the cart
                cart.items = cart.items.filter(item => item.productId !== productId); //TODO: check if productId is named properly
            } else {
                existingItem.quantity = updateItemDto.quantity;
            }
        }
        
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async updateCartItemGuest( productId: string, updateItemDto: UpdateCartItemDto, sessionId: string): Promise<Cart> {
        
        let cart = await this.getCartBySessionId(sessionId);

        const existingItem = cart.items.find(item => item.productId === productId); //TODO: check if productId is named properly
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (updateItemDto.quantity !== undefined) {
            if (updateItemDto.quantity === 0) {
                // If quantity is zero, remove the item from the cart
                cart.items = cart.items.filter(item => item.productId !== productId); //TODO: check if productId is named properly
            } else {
                existingItem.quantity = updateItemDto.quantity;
            }
        }
        
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);


        cart.items = cart.items.filter(item => item.productId !== productId); //TODO: check if productId is named properly

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async removeItemFromCartGuest(productId: string, sessionId: string): Promise<Cart> {    
        let cart = await this.getCartBySessionId(sessionId);
    
        cart.items = cart.items.filter(item => item.productId !== productId); //TODO: check if productId is named properly

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async applyCouponCode(userId: string, couponCode: string ): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        let couponCodeApplied = await this.getCouponByCode(couponCode);

        if( couponCodeApplied.limited ) {
            couponCodeApplied.quantity--;
        }
        cart.totalPricePostCoupon = cart.totalPricePreCoupon - (cart.totalPricePreCoupon * couponCodeApplied.couponPercentage)
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    } //recheck this later

    async applyCouponCodeGuest( couponCode: string, sessionId: string): Promise<Cart> {
        let cart = await this.getCartBySessionId(sessionId);
        let couponCodeApplied = await this.getCouponByCode(couponCode);

        if( couponCodeApplied.limited ) {
            throw new Error("You can't use this coupon code as a guest user!, Please create an account if you want to use this coupon.\nthis coupon is for " + couponCodeApplied.couponPercentage + "%")
        }
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    } //recheck this later

    async proceedToCheckout(userId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
        if (cart.items.length > 0) {
            throw new Error("Your cart is empty! Please go add new items to your cart")
        }
        cart.isCheckout = true;
        cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async proceedToCheckoutGuest( sessionId: string): Promise<Cart> {
        
        let cart = await this.getCartBySessionId(sessionId);
        if(cart){
            throw new Error(`Cannot proceed to checkout, because you are not a user`);
        }
        
        cart.isCheckout = true;
        cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    

    async placeOrder(userId: string, orderId: string): Promise<Cart>{
        let cart = await this.getCartByUserId(userId);
        if(cart.isCheckout != true) {
            throw new NotFoundException('You have not clicked on the checkout button! Please go back and click it!');
        }
        
        //look at credit card validation on profile

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async getCartByUserId(userId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userId }).exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }
    async getCartBySessionId(sessionId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ sessionId});
            if (!cart) {
                throw new NotFoundException('Cart not found');
            }
            return cart;
        }
        async getCouponByCode(couponCode: string): Promise<Coupon | null> {
            const coupon = await this.couponModel.findOne({ couponCode });
            return coupon ? coupon : null;
        }
}
