import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Coupon, CouponDocument }  from './schema/coupon.schema';
import { AddCartItemDto } from './dto/addcartitem.dto';
import { UpdateCartItemDto } from'./dto/updatecartitem.dto';
// import mongoose, { ObjectId } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schema/order.schema';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
        @InjectModel('Coupon') private readonly couponModel: Model<CouponDocument>,
        @InjectModel('Order') private readonly orderModel: Model<OrderDocument>) {}
  

    //rent

    async test(t: string): Promise<any> {
        return 'joe biden';
    }
    async addItemToCart(userId: string, addItemDto: AddCartItemDto): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId);        if (existingItemIndex !== -1) {
            // Item already exists in cart, update quantity
            cart.items[existingItemIndex].quantity += addItemDto.quantity;
        } else {
            // Item doesn't exist in cart, add new item
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId);            // At front end, update quantity to ensure that the person buying can pick the amount, otherwise set the quantity to 1
        }

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async addItemToCartGuest(addItemDto: AddCartItemDto, sessionId: string): Promise<Cart> {
        let cart = await this.getCartBySessionId(sessionId);
        if (!cart) {
            cart = new this.cartModel({ sessionId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId);        if (existingItemIndex !== -1) {
            // Item already exists in cart, update quantity
            cart.items[existingItemIndex].quantity += addItemDto.quantity;
        } else {
            // Item doesn't exist in cart, add new item
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId);            // At front end, update quantity to ensure that the person buying can pick the amount, otherwise set the quantity to 1
        }

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async rentProduct(userId: string, productId: string, rentalDuration: string): Promise<Cart> {
        // Retrieve the cart for the user
        let cart = await this.getCartByUserId(userId);
    
        // Find the product in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }
    
        // Update the existing item with rental information
        existingItem.rentalDuration = rentalDuration;
        existingItem.isRented = true;
    
        // Save the updated cart
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async rentProductGuest(sessionId: string, productId: string, rentalDuration: string): Promise<Cart> {
        // Retrieve the cart for the user
        let cart = await this.getCartBySessionId(sessionId);
    
        // Find the product in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }
    
        // Update the existing item with rental information
        existingItem.rentalDuration = rentalDuration;
        existingItem.isRented = true;
    
        // Save the updated cart
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }


    async updateCartItem(userId: string, productId: string, updateItemDto: UpdateCartItemDto): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (updateItemDto.quantity !== undefined) {
            if (updateItemDto.quantity === 0) {
                // If quantity is zero, remove the item from the cart
                cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId);
            } else {
                existingItem.quantity = updateItemDto.quantity;
            }
        }
        
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async updateCartItemGuest( productId: string, updateItemDto: UpdateCartItemDto, sessionId: string): Promise<Cart> {
        
        let cart = await this.getCartBySessionId(sessionId);

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (updateItemDto.quantity !== undefined) {
            if (updateItemDto.quantity === 0) {
                // If quantity is zero, remove the item from the cart
                cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId);
            } else {
                existingItem.quantity = updateItemDto.quantity;
            }
        }
        
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);


        cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId.toString());

        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    async removeItemFromCartGuest(productId: string, sessionId: string): Promise<Cart> {    
        let cart = await this.getCartBySessionId(sessionId);
    
        cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId.toString());

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

    // async proceedToCheckout(userId: string): Promise<Cart> {
    //     let cart = await this.getCartByUserId(userId);
    //     if (cart.items.length > 0) {
    //         throw new Error("Your cart is empty! Please go add new items to your cart")
    //     }
    //     // cart.isCheckout = true;
    //     // cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }
    async proceedToCheckoutGuest( sessionId: string): Promise<Cart> {
        
        let cart = await this.getCartBySessionId(sessionId);
        if(cart){
            //divert to sign up page?
            throw new Error(`Cannot proceed to checkout, because you are not a user`);
        }
        
        // cart.isCheckout = true;
        // cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
        const updatedCart = cart as CartDocument;
        return await updatedCart.save();
    }
    

    async placeOrder(userId: string, orderId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
    
        // if (!cart.isCheckout) {
        //     throw new NotFoundException('You have not clicked on the checkout button! Please go back and click it!');
        // }
        // function generateOrderNumber(): string {
        //     const timestamp = Date.now().toString();
        //     const usersId = this.userId.toString();
        //     const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 
        //     return `ORD-${usersId}-${timestamp}-${randomDigits}`;
        // }
        // const order = new Order();
    
        // order.userId = cart.userId;
        // order.orderNumber = generateOrderNumber(); 
        // order.orderDate = new Date();
        // order.total = cart.totalPricePostCoupon;
        // order.items = cart.items;
        // order.status = OrderStatus.PENDING; 
    
        // const savedOrder = order as OrderDocument; 
        // await savedOrder.save();
    
        // cart.items = [];
        // cart.isCheckout = false;
        // cart.couponCode = null; 
        // cart.couponPercentage = 0;
        // cart.totalPricePreCoupon = 0;
        // cart.totalPricePostCoupon = 0;

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
