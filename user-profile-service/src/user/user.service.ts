import {
    Injectable,
    NotFoundException,
    Req,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Address } from './schema/address.schema';
  import { Payment } from './schema/payment.schema';
  import { Wishlist } from './schema/wishlist.schema';
  import { ProducerService } from '../kafka/producer.service';
  
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectModel(Address.name) private readonly addressModel: Model<Address>,
      @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
      @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
      private readonly producerService: ProducerService,
    ) {}
  
    async getProfile(userId: string) {
      try {
          const profile = await this.addressModel
              .find({ userid: userId })
              .select('userid first_name last_name phone_number email')
              .exec();
  
          if (!profile) {
              throw new NotFoundException('profile not found');
          }
          return profile;
      } catch (error) {
          throw new NotFoundException('profile not found');
      }
  }
    
    async getAddress(userId: string){
      try {
        const address = await this.addressModel
          .find({ userid: userId })
          .exec();
          
        if (!address) {
          throw new NotFoundException('profile not found');
        }
        return address;
      } catch (error) {
        throw new NotFoundException('profile not found');
      }
    }
    //addAddress
    async addAddress(userId: string, body: any) {
      try {
          const address = new this.addressModel({
              userid: userId,
              addresslabel: body.addresslabel,
              apartment: body.apartment,
              email: body.email,
              floor: body.floor,
              first_name: body.first_name,
              street: body.street,
              building: body.building,
              phone_number: body.phone_number,
              postal_code: body.postal_code,
              extra_description: body.extra_description,
              city: body.city,
              country: body.country,
              last_name: body.last_name,
              state: body.state,
          });

          await address.save();

          return address;
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    //deleteAddress
    async deleteAddress(userId: string, addressId: string) {
      try {
          const address = await this.addressModel
              .findOneAndDelete({ userid: userId, _id: addressId })
              .exec();

          if (!address) {
              throw new NotFoundException('address not found');
          }

          return address;
      } catch (error) {
          throw new NotFoundException('address not found');
      }
    }

    //viewmyorderhistory KAFKA

    //editProfile
    async editProfile(userId: string, body: any) {
      try {
          const allowedUpdates = ['first_name', 'last_name', 'phone_number', 'email'];
          const updates = Object.keys(body);
          const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
          if (!isValidOperation) {
              throw new Error('Invalid updates!');
          }
  
          const updateData = {};
          for (let key of allowedUpdates) {
              if (body[key] !== undefined) {
                  updateData[key] = body[key];
              }
          }
  
          const updateResult: any = await this.addressModel
              .updateMany({ userid: userId }, updateData)
              .exec();
  
          if (updateResult.nModified === 0) {
              throw new NotFoundException('profile not found');
          }
  
          const profiles = await this.addressModel.find({ userid: userId }).exec();
  
          return profiles;
      } catch (error) {
          throw new NotFoundException('profile not found');
      }
  }

  //addCard
  async addCard(userId: string, body: any) {
    try {
        const card = new this.paymentModel({
            userid: userId,
            debitOrCredit: body.debitOrCredit,
            cardNumber: body.cardNumber,
            cvv: body.cvv,
            expiryDate: body.expiryDate,
            cardHolderName: body.cardHolderName,
        });

        await card.save();

        return card;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

//getCard
async getCard(userId: string) {
  try {
      const card = await this.paymentModel
          .find({ userid: userId })
          .exec();

      if (!card) {
          throw new NotFoundException('card not found');
      }

      return card;
  } catch (error) {
      throw new NotFoundException('card not found');
  }
}

//deleteCard
async deleteCard(userId: string, cardId: string) {
  try {
      const card = await this.paymentModel
          .findOneAndDelete({ userid: userId, _id: cardId })
          .exec();

      if (!card) {
          throw new NotFoundException('card not found');
      }

      return card;
  } catch (error) {
      throw new NotFoundException('card not found');
  }
}

//deleteWishlistItem
async deleteWishlistItem(userId: string, wishlistId: string) {
  try {
      const wishlist = await this.wishlistModel
          .findOneAndDelete({ userid: userId, _id: wishlistId })
          .exec();

      if (!wishlist) {
          throw new NotFoundException('wishlist item not found');
      }

      return wishlist;
  } catch (error) {
      throw new NotFoundException('wishlist item not found');

  }
}
  }
