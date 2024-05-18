import {
    Controller,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    ClassSerializerInterceptor,
    Req,
    HttpException,
    HttpStatus,
    Query
  } from '@nestjs/common';

  import { UserService } from './user.service';
  import { Address } from './schema/address.schema';
  import { Payment } from './schema/payment.schema';
  import { Wishlist } from './schema/wishlist.schema';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get('/address/:userId')
    async getAddress(@Param('userId') userId: string) {
      return await this.userService.getAddress(userId);
    }

    @Get('/profile/:userId')
    async getProfile(@Param('userId') userId: string) {
      return await this.userService.getProfile(userId);
    }

    @Patch('/editProfile/:userId')
    async editProfile(@Param('userId') userId: string, @Body() body: any) {
      return await this.userService.editProfile(userId, body);
    }

    @Post('/addAddress/:userId')
    async addAddress(@Param('userId') userId: string, @Body() body: any) {
      return await this.userService.addAddress(userId, body);
    }

    @Delete('/deleteAddress/:userId')
    async deleteAddress(@Param('userId') userId: string, @Query('addressId') addressId: string) {
      return await this.userService.deleteAddress(userId, addressId);
    }

    @Post ('addCard/:userId')
    async addCard(@Param('userId') userId: string, @Body() body: any) {
      return await this.userService.addCard(userId, body);
    }

    @Get ('/card/:userId')
    async getCard(@Param('userId') userId: string) {
      return await this.userService.getCard(userId);
    }

    @Delete ('/deleteCard/:userId')
    async deleteCard(@Param('userId') userId: string, @Query('cardId') cardId: string) {
      return await this.userService.deleteCard(userId, cardId);
    }

    @Delete ('/deleteWishlistItem/:userId')
    async deleteWishlistItem(@Param('userId') userId: string, @Query('wishlistId') wishlistId: string) {
      return await this.userService.deleteWishlistItem(userId, wishlistId);
    }

    @Get ('/mywishlist/:userId')
    async getWishlist(@Param('userId') userId: string) {
      return await this.userService.getWishlist(userId);
    }


  }