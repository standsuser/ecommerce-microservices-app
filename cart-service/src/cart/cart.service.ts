import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { Coupon } from './schema/coupon.schema';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Order, OrderStatus } from './schema/order.schema';
import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class CartService {
    constructor(
        private readonly consumerService: ConsumerService,
        @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
        @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>) { }

    async addItemToCart(userId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();

        if (!cart) {
            cart = new this.cartModel({ userid: userId, items: [] });
        }

        const quantity = addItemDto.quantity || 1;

        if (isNaN(quantity) || quantity <= 0) {
            throw new BadRequestException('Invalid quantity');
        }

        if (isNaN(addItemDto.amount_cents) || addItemDto.amount_cents <= 0) {
            throw new BadRequestException('Invalid amount_cents');
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            cart.markModified('items');
        } else {
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

        cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        if (isNaN(cart.total_price_pre_coupon)) {
            throw new BadRequestException('Invalid total price calculation');
        }

        await cart.save();

        return cart;
    }

    async getCartInfo(userId: string): Promise<any> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();
        if (!cart) {
            cart = new this.cartModel({ userid: userId, items: [] });
            await cart.save();
        }
        return cart;
    }

    async getCartItems(userId: string): Promise<any> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();
        if (!cart) {
            cart = new this.cartModel({ userid: userId, items: [] });
            await cart.save();
        }
        return cart.items;
    }

    async updateCartItem(userId: string, productId: string, updateDto: AddToCartDto): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();

        if (!cart) {
            cart = new this.cartModel({ userid: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }
        const item = cart.items[itemIndex];

        item.quantity = updateDto.quantity ?? item.quantity;
        item.rentalDuration = updateDto.rentalDuration ?? item.rentalDuration;
        item.isRented = updateDto.isRented ?? item.isRented;
        item.name = updateDto.name ?? item.name;
        item.amount_cents = updateDto.amount_cents ?? item.amount_cents;
        item.description = updateDto.description ?? item.description;
        item.color = updateDto.color ?? item.color;
        item.size = updateDto.size ?? item.size;
        item.material = updateDto.material ?? item.material;

        cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        if (isNaN(cart.total_price_pre_coupon)) {
            throw new BadRequestException('Invalid total price calculation');
        }
        cart.markModified('items');
        await cart.save();
        return cart;
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }

        cart.items.splice(itemIndex, 1);

        cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        if (isNaN(cart.total_price_pre_coupon)) {
            throw new BadRequestException('Invalid total price calculation');
        }

        cart.markModified('items');
        await cart.save();
        return cart;
    }

    async applyCouponCode(userId: string, couponCode: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const coupon = await this.couponModel.findOne({ coupon_code: couponCode }).exec();
        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        if (cart.total_price_pre_coupon === null || cart.total_price_pre_coupon === undefined) {
            throw new Error('Cart total price before coupon is not set');
        }

        const totalDiscount = cart.total_price_pre_coupon * (coupon.coupon_percentage / 100);
        cart.total_price_post_coupon = cart.total_price_pre_coupon - totalDiscount;
        cart.coupon_code = coupon.coupon_code;
        cart.coupon_percentage = coupon.coupon_percentage;

        cart.markModified('items');
        await cart.save();
        return cart;
    }

    async createOrder(userId: string, shippingData: any): Promise<Order> {
        let cart = await this.cartModel.findOne({ userid: userId }).exec();

        if (!cart || cart.items.length === 0) {
            throw new NotFoundException('Cart is empty or not found');
        }
        let totalAmountCents = cart.total_price_pre_coupon;
        if (cart.total_price_post_coupon !== null) {
            totalAmountCents = cart.total_price_post_coupon;
        }

        const newOrder = new this.orderModel({
            userid: userId,
            delivery_needed: true,
            amount_cents: totalAmountCents,
            currency: 'EGP',
            items: cart.items,
            status: OrderStatus.PENDING,
            shipping_data: shippingData,
            payment_info: {
                amount_cents: totalAmountCents,
                expiration: 3600,
                billing_data: shippingData,
                currency: 'EGP',
                integration_id: 4570504,
                lock_order_when_paid: 'true',
            },
        });

        await newOrder.save();

        await this.cartModel.updateOne(
            { userid: userId },
            {
                $set: {
                    items: [],
                    total_price_pre_coupon: 0,
                    total_price_post_coupon: null,
                    coupon_code: null,
                    coupon_percentage: null,
                    is_checkout: false,
                    updated_at: new Date(),
                }
            }
        ).exec();

        return newOrder;
    }

    // Guest operations

    async addItemToGuestCart(sessionId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ session_id: sessionId }).exec();

        if (!cart) {
            cart = new this.cartModel({ session_id: sessionId, items: [] });
        }

        const quantity = addItemDto.quantity || 1;

        if (isNaN(quantity) || quantity <= 0) {
            throw new BadRequestException('Invalid quantity');
        }

        if (isNaN(addItemDto.amount_cents) || addItemDto.amount_cents <= 0) {
            throw new BadRequestException('Invalid amount_cents');
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            cart.markModified('items');
        } else {
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

        cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        if (isNaN(cart.total_price_pre_coupon)) {
            throw new BadRequestException('Invalid total price calculation');
        }

        await cart.save();

        return cart;
    }

    async getItemsFromGuestCart(sessionId: string): Promise<any> {
        let cart = await this.cartModel.findOne({ session_id: sessionId }).exec();
        if (!cart) {
            cart = new this.cartModel({ session_id: sessionId, items: [] });
            await cart.save();
        }
        return cart.items;
    }

    async removeItemFromGuestCart(sessionId: string, productId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ session_id: sessionId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('No items in cart');
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }

        cart.items.splice(itemIndex, 1);

        cart.total_price_pre_coupon = cart.items.reduce((total, item) => total + (item.amount_cents * item.quantity), 0);

        if (isNaN(cart.total_price_pre_coupon)) {
            throw new BadRequestException('Invalid total price calculation');
        }

        cart.markModified('items');
        await cart.save();
        return cart;
    }

    async viewOrderHistory(userId: string): Promise<Order[]> {
        const orders = await this.orderModel.find({ userid: userId }).exec();
        if (!orders) {
            throw new NotFoundException('No orders are linked to your account');
        }
        return orders;
    }

    async convertGuestToUser(userId: string, sessionId: string): Promise<Cart> {
        const guestCart = await this.cartModel.findOne({ session_id: sessionId }).exec();
        if (!guestCart) {
            throw new NotFoundException('Guest cart not found');
        }

        let userCart = await this.cartModel.findOne({ userid: userId }).exec();
        if (userCart) {
            guestCart.items.forEach(guestItem => {
                const existingItemIndex = userCart.items.findIndex(item => item.productId.toString() === guestItem.productId.toString());
                if (existingItemIndex !== -1) {
                    userCart.items[existingItemIndex].quantity += guestItem.quantity;
                } else {
                    userCart.items.push(guestItem);
                }
            });
            await userCart.save();
            await this.cartModel.deleteOne({ session_id: sessionId }).exec();
            return userCart;
        } else {
            guestCart.userid = new Types.ObjectId(userId);
            guestCart.session_id = null;
            await guestCart.save();
            return guestCart;
        }
    }
}