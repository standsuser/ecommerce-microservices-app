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


  }


// @Controller('profile')
// export class AppController {
//   AppService: any;
//   constructor(
//     private readonly appService: AppService,
//     private readonly orderService: OrderService
//   ) {}


//   @Patch(':userId/password')
// async updatePassword(
//     @Param('userId') userId: string,
//     @Body() passwordDto: UpdatePasswordDto
// ): Promise<any> {
//     try {
//         const updateSuccessful = await this.appService.updatePassword(
//             userId, 
//             passwordDto.currentPassword, 
//             passwordDto.newPassword,
//         );

//         if (passwordDto.currentPassword === passwordDto.newPassword) { // instead of checking if true, checking if they are the same
//             return { status: 'success', message: 'Password updated successfully.' };
//         } else {
//             return { status: 'error', message: 'Password update failed.' };
//         }
//     } catch (error) {
//         return { status: 'error', message: error.message };
//     }
// }
//   @Get(':userId')
//   async getUserProfile(@Param('userId') userId: string) {
//     const userProfile = await this.appService.findUserProfile(userId);
//     if (userProfile) {
//       return userProfile;
//     } else {
//       return { status: 'error', message: 'User not found' };
//     }
//   }

//   @Patch(':userId')
//   async updateUserProfile(@Param('userId') userId: string, @Body() userProfileData: Partial<User>) {
//     const updatedUserProfile = await this.appService.updateUserProfile(userId, userProfileData);
//     if (updatedUserProfile) {
//       return updatedUserProfile;
//     } else {
//       return { status: 'error', message: 'Unable to update profile' };
//     }
//   }

//   @Get(':userId/orders')
//   async getUserOrderHistory(@Param('userId') userId: string) {
//     const orderHistory = await this.orderService.findUserOrders(userId);
//     if (orderHistory && orderHistory.length > 0) {
//       return orderHistory;
//     } else {
//       return { status: 'error', message: 'No orders found for this user' };
//     }
//   }

// }