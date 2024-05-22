import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Put,
    Delete,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updatecartitem.dto';
import { Cart } from './schema/cart.schema';
import { ConvertGuestToUserDto } from './dto/convertGuestToUser.dto';
import { Order } from './schema/order.schema';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('/:userId/add-item/:productId')
    async addItemToCart(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
        @Body() addItemDto: AddToCartDto,
    ): Promise<Cart> {
        try {
            return await this.cartService.addItemToCart(
                userId,
                addItemDto,
                productId,
            );
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
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

    @Put('/update-item/:userId/:productId')
    async updateCartItem(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
        @Body() updateDto: AddToCartDto,
    ): Promise<Cart> {
        try {
            return await this.cartService.updateCartItem(
                userId,
                productId,
                updateDto,
            );
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Delete('/remove-item/:userId/:productId')
    async removeItemFromCart(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.removeItemFromCart(userId, productId);
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
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
        try {
            return await this.cartService.createOrder(userId, shippingData);
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }



    @Get('/:user_id/orders')
    async viewOrderHistory(
        @Param('user_id') userId: string,
    ): Promise<Order[]> {
        try {
            return await this.cartService.viewOrderHistory(
                userId
            );
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }


    @Post('/guest/:sessionId/add-item/:productId')
    async addItemToGuestCart(
        @Param('sessionId') sessionId: string,
        @Param('productId') productId: string,
        @Body() addItemDto: AddToCartDto,
    ): Promise<Cart> {
        try {
            return await this.cartService.addItemToGuestCart(
                sessionId,
                addItemDto,
                productId,
            );
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Get('guest/:sessionId/items')
    async getItemsFromGuestCart(
        @Param('sessionId') sessionId: string,
    ): Promise<any> {
        try {
            const items = await this.cartService.getItemsFromGuestCart(sessionId);
            return items;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Delete('/guest/:sessionId/remove-item/:productId')
    async removeItemFromGuestCart(
        @Param('sessionId') sessionId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.removeItemFromGuestCart(
                sessionId,
                productId,
            );
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    @Post('/:userId/add-one/:productId')
    async addOneItem(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.addOneItem(userId, productId);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Post('/:userId/remove-one/:productId')
    async removeOneItem(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.removeOneItem(userId, productId);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Post('/guest/:sessionId/add-one/:productId')
    async addOneItemGuest(
        @Param('sessionId') sessionId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.addOneItemGuest(sessionId, productId);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Post('/guest/:sessionId/remove-one/:productId')
    async removeOneItemGuest(
        @Param('sessionId') sessionId: string,
        @Param('productId') productId: string,
    ): Promise<Cart> {
        try {
            return await this.cartService.removeOneItemGuest(sessionId, productId);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    @Post('convert-guest-to-user')
    async convertGuestToUser(
        @Body() convertGuestToUserDto: ConvertGuestToUserDto,
    ): Promise<Cart> {
        const { userId, sessionId } = convertGuestToUserDto;
        return this.cartService.convertGuestToUser(userId, sessionId);
    }
}
