import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}


// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, Order, Address } from './schema';

// @Injectable()
// export class AppService {
//   updatePassword(userId: string, currentPassword: string, newPassword: string) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(
//     @InjectModel('User') private readonly userModel: Model<User>,
//     @InjectModel('Order') private readonly orderModel: Model<Order>,
//     // @InjectModel('PaymentMethod') private readonly paymentMethodModel: Model<PaymentMethod>, // Ensure this is injected if used
//     @InjectModel('Address') private readonly addressModel: Model<Address> // Ensure this is injected if used
//   ) {}

//   async findUserProfile(userId: string): Promise<User | undefined> {
//     return this.userModel.findOne({ userId }).exec();
//   }

//   async updateUserProfile(userId: string, userProfileData: Partial<User>): Promise<User> {
//     return this.userModel.findOneAndUpdate({ userId }, userProfileData, { new: true }).exec();
//   }
// }

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel('Order') private readonly orderModel: Model<Order>,
//     @InjectModel('User') private readonly userModel: Model<User>,  // Inject the User model
//    // @InjectModel('PaymentMethod') private readonly paymentMethodModel: Model<PaymentMethod>,  
//     @InjectModel('Address') private readonly addressModel: Model<Address> // Inject the Address model 

//   ) {}
//   async findUserOrders(userId: string): Promise<Order[]> {
//     return this.orderModel.find({ userId }).exec();
//   }

//   async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
//     const user = await this.userModel.findById(userId).exec();
//     if (!user) {
//       throw new Error('User not found.');
//     }
  
//     if (currentPassword !== user.password) {  // Plain text comparison for now, consider hashing for production
//       throw new Error('Current password is incorrect.');
//     }
  
//     user.password = newPassword;  // Update to use hashed passwords in a real scenario
//     await user.save();
//     return true;  // Return true to indicate success
//   }

//   async addAddress(userId: string, addressData: Partial<Address>): Promise<User> {
//     const user = await this.userModel.findById(userId).exec();
//     if (!user) {
//       throw new Error('User not found');
//     }
//     const address = new this.addressModel({ ...addressData, userId });
//     user.addresses.push(address._id);
//     await user.save();
//     await address.save();
//     return user;
//   }

//   async updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<Address> {
//     return this.addressModel.findOneAndUpdate({ _id: addressId, userId }, addressData, { new: true }).exec();
//   }

//   async deleteAddress(userId: string, addressId: string): Promise<any> {
//     return this.addressModel.deleteOne({ _id: addressId, userId });
//   }
// }