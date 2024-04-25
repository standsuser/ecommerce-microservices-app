import { Controller, Post, Body, Param, Patch, Delete, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/addcartitem.dto';
import { UpdateCartItemDto } from'./dto/updatecartitem.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post(':userId/items')
    async addItemToCart(@Param('userId') userId: string, @Body() addItemDto: AddCartItemDto) {
        return this.cartService.addItemToCart(userId, addItemDto);
    }

    @Post(':sessionId/items')
    async addItemToCartGuest(@Param('sessionId') sessionId: string, @Body() addItemDto: AddCartItemDto) {
        return this.cartService.addItemToCart(sessionId, addItemDto);
    }

    @Patch(':userId/items/:productId')
    async updateCartItem(@Param('userId') userId: string, @Param('productId') productId: string, @Body() updateItemDto: UpdateCartItemDto) {
        return this.cartService.updateCartItem(userId, productId, updateItemDto);
    }

    @Patch(':sessionId/items/:productId')
    async forwardUpdateCartItem(@Param('sessionId') sessionId: string, @Param('productId') productId: string, @Body() updateItemDto: UpdateCartItemDto) {
        return this.cartService.updateCartItem(sessionId, productId, updateItemDto);
    }

    @Delete(':userId/items/:productId')
    async removeItemFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.cartService.removeItemFromCart(userId, productId);
    }

    @Delete(':sessionId/items/:productId')
    async forwardRemoveItemFromCart(@Param('sessionId') sessionId: string, @Param('productId') productId: string) {
        return this.cartService.removeItemFromCart(sessionId, productId);
    }

    @Patch(':userId/apply-coupon')
    async applyCouponCode(@Param('userId') userId: string, @Body('couponCode') couponCode: string) {
        return this.cartService.applyCouponCode(userId, couponCode);
    }

    @Patch(':sessionId/apply-coupon')
    async forwardApplyCouponCode(@Param('sessionId') sessionId: string, @Body('couponCode') couponCode: string) {
        return this.cartService.applyCouponCode(sessionId, couponCode);
    }

    @Patch(':userId/checkout')
    async proceedToCheckout(@Param('userId') userId: string) {
        return this.cartService.proceedToCheckout(userId);
    }

    @Patch(':sessionId/checkout')
    async forwardProceedToCheckout(@Param('sessionId') sessionId: string) {
        return this.cartService.proceedToCheckout(sessionId);
    }

    @Get(':userId/cart')
    async getCartByUserId(@Param('userId') userId: string) {
        return this.cartService.getCartByUserId(userId);
    }

    @Get(':sessionId/cart')
    async getCartBySessionId(@Param('sessionId') sessionId: string) {
    return this.cartService.getCartBySessionId(sessionId);
}
}