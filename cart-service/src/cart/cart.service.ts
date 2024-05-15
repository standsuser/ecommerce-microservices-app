import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Coupon, CouponDocument } from './schema/coupon.schema';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Order, OrderDocument, OrderStatus } from './schema/order.schema';
import { ConsumerService } from '../kafka/consumer.service';


@Injectable()
export class CartService {
    constructor(
        private readonly consumerService: ConsumerService,
        @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
        @InjectModel('Coupon') private readonly couponModel: Model<CouponDocument>,
        @InjectModel('Order') private readonly orderModel: Model<OrderDocument>) { }


    async getCartByUserId(userId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userId }).exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }

    async addItemToCart(userId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
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

    async rentProduct(userId: string, addItemDto: AddToCartDto, productId: string, rentalDuration: string): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);
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

    async getCartItems(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ user_id: userId }).exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }
    async updateCartItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items[itemIndex].quantity = updateCartItemDto.quantity;
        await cart.save();
        return cart;
    }

    async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        if (updatedItems.length === cart.items.length) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items = updatedItems;
        await cart.save();
        return cart;
    }


    async applyCouponCode(userId: string, couponCode: string): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);
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

        await cart.save();
        return cart;
    }

    async placeOrder(userId: string, orderId: string): Promise<any> {
        let cart = await this.getCartByUserId(userId);

        const merchant_order_id = ((num: number) => (num ** 2 * 8) * 10 + Math.random() / Math.random())(parseInt(userId));

        cart.is_checkout = true;
        // make kafka call to paymob service
        const updatedCart = cart as CartDocument;
        return updatedCart.save();
    }

    async proceedToCheckout(userId: string): Promise<any> {
        let cart = await this.getCartByUserId(userId);
        if (cart.items.length > 0) {
            throw new Error("Your cart is empty! Please go add new items to your cart")
        }
        cart.is_checkout = true;
        // cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
        const updatedCart = cart as CartDocument;
        return updatedCart.save();
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------
    //Guest  

    async getCartBySessionId(sessionId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ sessionId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }

    async addItemToGuestCart(sessionId: string, addItemDto: AddToCartDto, productId: string): Promise<Cart> {
        let cart = await this.getCartBySessionId(sessionId);
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
        const cart = await this.getCartByUserId(sessionId);
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        if (updatedItems.length === cart.items.length) {
            throw new NotFoundException('Item not found in cart');
        }
        cart.items = updatedItems;
        await cart.save();
        return cart;
    }

    async convertGuestToUser(userId: string, sessionId: string): Promise<Cart> {
        const guestCart = await this.getCartBySessionId(sessionId);
        if (!guestCart) {
          throw new NotFoundException('Guest cart not found');
        }
    
        let userCart = await this.getCartByUserId(userId);
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
    // async addItemToCartGuest(addItemDto: AddCartItemDto, sessionId: string): Promise<Cart> {
    //     let cart = await this.getCartBySessionId(sessionId);
    //     if (!cart) {
    //         cart = new this.cartModel({ sessionId, items: [] });
    //     }

    //     const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId); if (existingItemIndex !== -1) {
    //         // Item already exists in cart, update quantity
    //         cart.items[existingItemIndex].quantity += addItemDto.quantity;
    //     } else {
    //         // Item doesn't exist in cart, add new item
    //         const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === addItemDto.productId);            // At front end, update quantity to ensure that the person buying can pick the amount, otherwise set the quantity to 1
    //     }

    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }
    // async rentProduct(userId: string, productId: string, rentalDuration: string): Promise<Cart> {
    //     // Retrieve the cart for the user
    //     let cart = await this.getCartByUserId(userId);

    //     // Find the product in the cart
    //     const existingItem = cart.items.find(item => item.productId.toString() === productId);
    //     if (!existingItem) {
    //         throw new NotFoundException('Item not found in cart');
    //     }

    //     // Update the existing item with rental information
    //     existingItem.rentalDuration = rentalDuration;
    //     existingItem.isRented = true;

    //     // Save the updated cart
    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }

    // async rentProductGuest(sessionId: string, productId: string, rentalDuration: string): Promise<Cart> {
    //     // Retrieve the cart for the user
    //     let cart = await this.getCartBySessionId(sessionId);

    //     // Find the product in the cart
    //     const existingItem = cart.items.find(item => item.productId.toString() === productId);
    //     if (!existingItem) {
    //         throw new NotFoundException('Item not found in cart');
    //     }

    //     // Update the existing item with rental information
    //     existingItem.rentalDuration = rentalDuration;
    //     existingItem.isRented = true;

    //     // Save the updated cart
    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }


    // // async updateCartItem(userId: string, productId: string, updateItemDto: UpdateCartItemDto): Promise<Cart> {
    // //     let cart = await this.getCartByUserId(userId);

    // //     const existingItem = cart.items.find(item => item.productId.toString() === productId);
    // //     if (!existingItem) {
    // //         throw new NotFoundException('Item not found in cart');
    // //     }

    // //     if (updateItemDto.quantity !== undefined) {
    // //         if (updateItemDto.quantity === 0) {
    // //             // If quantity is zero, remove the item from the cart
    // //             cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId);
    // //         } else {
    // //             existingItem.quantity = updateItemDto.quantity;
    // //         }
    // //     }

    // //     const updatedCart = cart as CartDocument;
    // //     return await updatedCart.save();
    // // }
    // async updateCartItemGuest(productId: string, updateItemDto: UpdateCartItemDto, sessionId: string): Promise<Cart> {

    //     let cart = await this.getCartBySessionId(sessionId);

    //     const existingItem = cart.items.find(item => item.productId.toString() === productId);
    //     if (!existingItem) {
    //         throw new NotFoundException('Item not found in cart');
    //     }

    //     if (updateItemDto.quantity !== undefined) {
    //         if (updateItemDto.quantity === 0) {
    //             // If quantity is zero, remove the item from the cart
    //             cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId);
    //         } else {
    //             existingItem.quantity = updateItemDto.quantity;
    //         }
    //     }

    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }

    // // async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
    // //     let cart = await this.getCartByUserId(userId);


    // //     cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId.toString());

    // //     const updatedCart = cart as CartDocument;
    // //     return await updatedCart.save();
    // // }
    // async removeItemFromCartGuest(productId: string, sessionId: string): Promise<Cart> {
    //     let cart = await this.getCartBySessionId(sessionId);

    //     cart.items = cart.items.filter(item => !item.productId || item.productId.toString() !== productId.toString());

    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // }

    // async applyCouponCode(userId: string, couponCode: string): Promise<Cart> {
    //     let cart = await this.getCartByUserId(userId);
    //     let couponCodeApplied = await this.getCouponByCode(couponCode);

    //     if (couponCodeApplied.limited) {
    //         couponCodeApplied.quantity--;
    //     }
    //     cart.total_price_post_coupon = cart.total_price_pre_coupon - (cart.total_price_pre_coupon * couponCodeApplied.coupon_percentage)
    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // } //recheck this later

    // async applyCouponCodeGuest(couponCode: string, sessionId: string): Promise<Cart> {
    //     let cart = await this.getCartBySessionId(sessionId);
    //     let couponCodeApplied = await this.getCouponByCode(couponCode);

    //     if (couponCodeApplied.limited) {
    //         throw new Error("You can't use this coupon code as a guest user!, Please create an account if you want to use this coupon.\nthis coupon is for " + couponCodeApplied.coupon_percentage + "%")
    //     }
    //     const updatedCart = cart as CartDocument;
    //     return await updatedCart.save();
    // } //recheck this later

    // // async proceedToCheckout(userId: string): Promise<Cart> {
    // //     let cart = await this.getCartByUserId(userId);
    // //     if (cart.items.length > 0) {
    // //         throw new Error("Your cart is empty! Please go add new items to your cart")
    // //     }
    // //     // cart.isCheckout = true;
    // //     // cart.totalPricePostCoupon = cart.totalPricePreCoupon - cart.totalPricePreCoupon * cart.couponPercentage;
    // //     const updatedCart = cart as CartDocument;
    // //     return await updatedCart.save();
    // // }


