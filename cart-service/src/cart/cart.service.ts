import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { Coupon } from './schema/coupon.schema';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Order, OrderStatus } from './schema/order.schema';
import { ConsumerService } from '../kafka/consumer.service';
import { error } from 'console';


@Injectable()
export class CartService {
    constructor(
        private readonly consumerService: ConsumerService,
        @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
        @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>) { }



    //TESTED :O

        async addItemToCart(userId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
            const cart = await this.cartModel.findOne({ userId }).exec();
    
            if (!cart) {
                throw new NotFoundException('Cart not found');
            }
    
            const quantity = addItemDto.quantity || 1; // Default quantity to 1 if not provided
    
            if (isNaN(quantity) || quantity <= 0) {
                throw new BadRequestException('Invalid quantity');
            }
    
            if (isNaN(addItemDto.amount_cents) || addItemDto.amount_cents <= 0) {
                throw new BadRequestException('Invalid amount_cents');
            }
    
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
            if (itemIndex > -1) {
                // Item already exists in cart, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({
                    productId: productId,
                    rentalDuration: addItemDto.rentalDuration || 'N/A',
                    isRented: addItemDto.isRented ?? false,
                    name: addItemDto.name,
                    amount_cents: addItemDto.amount_cents,
                    description: addItemDto.description,
                    color: addItemDto.color,
                    size: addItemDto.size,
                    material: addItemDto.material,
                    quantity: quantity,
                });
            }
    
            // Calculate total price pre-coupon
            cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);
    
            if (isNaN(cart.total_price_pre_coupon)) {
                throw new BadRequestException('Invalid total price calculation');
            }
    
            // Save updated cart
            await cart.save();
    
            return cart;
        
    }

    async rentProduct(userId: string, addItemDto: AddToCartDto, productId: string, rentalDuration: string): Promise<Cart> {
        let cart = await this.getCartInfo(userId);
        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        const quantity = addItemDto.quantity;

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            const newItem = {
                productId: productId,
                rentalDuration: rentalDuration,
                isRented: true,
                name: addItemDto.name,
                amount_cents: addItemDto.amount_cents,
                description: addItemDto.description,
                color: addItemDto.color,
                size: addItemDto.size,
                material: addItemDto.material,
                quantity: quantity,
            };

            cart.items.push(newItem);
        }
        // Save the updated cart
        await cart.save();
        return cart;
    }

    //tested :O
    async getCartInfo(userId: string): Promise<any> {
        try {
            const cart = await this.cartModel.findOne({ userId }).exec();
            if (!cart) {
                throw new NotFoundException('Cart not found');
            }
            return cart;
        } catch (error) {
            if (error instanceof NotFoundException) {
                console.error(error.message);
            } else {
                console.error(`Error retrieving cart for userId: ${userId}`, error);
            }
            throw error;
        }
    }


    // Tested :O 
    async getCartItems(userId: string): Promise<any> {
        try {
            const cart = await this.cartModel.findOne({ userId }).exec();
            if (!cart) {
                throw new NotFoundException('Cart not found');
            }
            console.log(JSON.stringify(cart.items));
            return cart.items;
        } catch (error) {
            if (error instanceof NotFoundException) {
                console.error(error.message);
            } else {
                console.error(`Error retrieving cart for userId: ${userId}`, error);
            }
            throw error;
        }
    }

    async updateCartItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
        const cart = await this.getCartInfo(userId);
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items[itemIndex].quantity = updateCartItemDto.quantity;
        await cart.save();
        return cart;
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        const cart = await this.getCartInfo(userId);
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        if (updatedItems.length === cart.items.length) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items = updatedItems;
        await cart.save();
        return cart;
    }


    //tested :O
    async applyCouponCode(userId: string, couponCode: string): Promise<Cart> {
        const cart = await this.getCartInfo(userId);
        const coupon = await this.couponModel.findOne({ coupon_code: couponCode }).exec();

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        if (cart.total_price_post_coupon !== null) {
            throw new Error('Coupon code has already been applied');
        }


        const totalDiscount = cart.total_price_pre_coupon * (coupon.coupon_percentage / 100);
        cart.total_price_post_coupon = cart.total_price_pre_coupon - totalDiscount;
        cart.coupon_code = coupon.coupon_code;
        cart.coupon_percentage = coupon.coupon_percentage;


        await cart.save();
        return cart;
    }

    //TESTED :O
    async createOrder(userId: string, shippingData: any): Promise<Order> {
        const cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart || cart.items.length === 0) {
            throw new NotFoundException('Cart is empty or not found');
        }

        const totalAmountCents = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        const newOrder = new this.orderModel({
            user_id: userId,
            delivery_needed: true,
            amount_cents: totalAmountCents,
            currency: 'USD', // Set the currency appropriately
            merchant_order_id: Date.now(), // Example of generating an order ID
            items: cart.items,
            status: OrderStatus.PENDING,
            shipping_data: shippingData,
            payment_info: {
                order_id: Date.now(),
                amount_cents: totalAmountCents,
                expiration: 3600, 
                billing_data: shippingData, 
                currency: 'EGP',
                integration_id: 4570504, 
                lock_order_when_paid: 'true',
            },
        });

        await newOrder.save();

        // Optionally, you can clear the cart after creating the order
        await this.cartModel.updateOne({ userId }, { $set: { items: [] } }).exec();

        return newOrder;
    }

    async proceedToCheckout(userId: string): Promise<any> {
        let cart = await this.getCartInfo(userId);
        if (cart.items.length > 0) {
            throw new Error("Your cart is empty! Please go add new items to your cart")
        }
        cart.is_checkout = true;
        // cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
        const updatedCart = cart as Cart;
        return updatedCart.save();
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------
    //Guest  

    async addItemToGuestCart(sessionId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
        let cart = await this.getItemsFromGuestCart(sessionId);
        if (!cart) {
            cart = new this.cartModel({ sessiond_id: sessionId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === addItemDto.item_id);
        const quantity = addItemDto.quantity;

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            const newItem = {
                productId: productId,
                rentalDuration: null,
                isRented: false,
                name: addItemDto.name,
                amount_cents: addItemDto.amount_cents,
                description: addItemDto.description,
                color: addItemDto.color,
                size: addItemDto.size,
                material: addItemDto.material,
                quantity: quantity,
            };

            cart.items.push(newItem);
        }

        // Save the updated cart
        await cart.save();
        return cart;
    }

    async getItemsFromGuestCart(sessionId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ sessiond_id: sessionId }).exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }

    async removeItemFromGuestCart(sessionId: string, productId: string): Promise<Cart> {
        const cart = await this.getItemsFromGuestCart(sessionId);
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        if (updatedItems.length === cart.items.length) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items = updatedItems;
        await cart.save();
        return cart;
    }

    async convertGuestToUser(userId: string, sessionId: string): Promise<Cart> {
        const guestCart = await this.getItemsFromGuestCart(sessionId);
        if (!guestCart) {
            throw new NotFoundException('Guest cart not found');
        }

        let userCart = await this.getItemsFromGuestCart(userId);
        if (userCart) {
            // Merge guest cart items into existing user cart
            // const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

            guestCart.items.forEach(guestItem => {
                const existingItemIndex = userCart.items.findIndex(
                    item => item.productId === guestItem.productId.toString()
                );
                if (existingItemIndex !== -1) {
                    userCart.items[existingItemIndex].quantity += guestItem.quantity;
                } else {
                    userCart.items.push(guestItem);
                }
            });
            await userCart.save();
            return userCart;
        } else {
            // Create a new user cart with guest cart items
            guestCart.sessiond_id = null;
            await guestCart.save();
            return guestCart;
        }
    }
}
