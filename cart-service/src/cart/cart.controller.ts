import { Controller, Post, Body, Param, Patch, Delete, Get } from '@nestjs/common';
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

    @Patch(':userId/items/:productId')
    async updateCartItem(@Param('userId') userId: string, @Param('productId') productId: string, @Body() updateItemDto: UpdateCartItemDto) {
        return this.cartService.updateCartItem(userId, productId, updateItemDto);
    }

    @Delete(':userId/items/:productId')
    async removeItemFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.cartService.removeItemFromCart(userId, productId);
    }

    @Patch(':userId/apply-coupon')
    async applyCouponCode(@Param('userId') userId: string, @Body('couponCode') couponCode: string) {
        return this.cartService.applyCouponCode(userId, couponCode);
    }

    @Patch(':userId/checkout')
    async proceedToCheckout(@Param('userId') userId: string) {
        return this.cartService.proceedToCheckout(userId);
    }

    @Get(':userId')
    async getCartDetails(@Param('userId') userId: string) {
        return this.cartService.getCartDetails(userId);
    }
}