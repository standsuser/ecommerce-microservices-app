import { Controller, Post, Body, Param, Get, Put, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Cart } from './schema/cart.schema';

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

    @Get(':userId')
    async getCartItems(@Param('userId') userId: string): Promise<Cart> {
        return this.cartService.getCartItems(userId);
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

    @Post(':userId/apply-coupon/:couponCode')
    async applyCouponCode(
        @Param('userId') userId: string,
        @Param('couponCode') couponCode: string,
    ): Promise<Cart> {
        return this.cartService.applyCouponCode(userId, couponCode);
    }

    @Post(':userId/place-order/:orderId')
    async placeOrder(
        @Param('userId') userId: string,
        @Param('orderId') orderId: string,
    ): Promise<Cart> {
        const updatedCart = await this.cartService.placeOrder(userId, orderId);
        return updatedCart;
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
      return this.cartService.addItemToGuestCart(sessionId, addItemDto);
    }
}