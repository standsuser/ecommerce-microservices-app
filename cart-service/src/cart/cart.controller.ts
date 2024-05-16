import { Controller, Post, Body, Param, Get, Put, Delete, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Cart } from './schema/cart.schema';
import { ConvertGuestToUserDto } from './dto/convertGuestToUser.dto';
import { Order } from './schema/order.schema';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post(':userId/add-item/:productId')
    async addItemToCart(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
        @Body() addItemDto: AddToCartDto,
    ): Promise<Cart> {
        return this.cartService.addItemToCart(userId, addItemDto, productId);
    }

    @Get('get-cart-info/:userId')
    async getCartInfo(@Param('userId') userId: string): Promise<any> {
        return this.cartService.getCartInfo(userId);
    }
    @Get('items/:userId')
    async getCartItems(@Param('userId') userId: string) {
        try {
            const items = await this.cartService.getCartItems(userId);
            return items;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }
    @Put(':userId/update-item/:productId')
    async updateCartItem(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ): Promise<Cart> {
        return this.cartService.updateCartItem(userId, productId, updateCartItemDto);
    }

    @Delete(':userId/remove-item/:productId')
    async removeItemFromCart(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        return this.cartService.removeItemFromCart(userId, productId);
    }

    @Post('apply-coupon/:userId/:couponCode')
    async applyCouponCode(
        @Param('userId') userId: string,
        @Param('couponCode') couponCode: string,
    ): Promise<Cart> {
        return this.cartService.applyCouponCode(userId, couponCode);
    }
    @Post(':userId/createOrder')
    async createOrder(
        @Param('userId') userId: string,
        @Body('shipping_data') shippingData: any,
    ): Promise<Order> {
        return this.cartService.createOrder(userId, shippingData);
    }


    @Post(':userId/proceed-to-checkout')
    async proceedToCheckout(
        @Param('userId') userId: string,
    ): Promise<Cart> {
        const updatedCart = await this.cartService.proceedToCheckout(userId);
        return updatedCart;
    }

    @Post('guest/:sessionId/add-item')
    async addItemToGuestCart(
        @Param('sessionId') sessionId: string,
        @Body() addItemDto: AddToCartDto,
    ): Promise<Cart> {
        return this.cartService.addItemToGuestCart(sessionId, addItemDto, addItemDto.item_id);
    }

    @Get('guest/:sessionId/items')
    async getItemsFromGuestCart(@Param('sessionId') sessionId: string): Promise<Cart> {
        return this.cartService.getItemsFromGuestCart(sessionId);
    }

    @Post('convert-guest-to-user')
    async convertGuestToUser(@Body() convertGuestToUserDto: ConvertGuestToUserDto): Promise<Cart> {
        const { userId, sessionId } = convertGuestToUserDto;
        return this.cartService.convertGuestToUser(userId, sessionId);
    }

}