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
import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    // Consume 'wishlist' topic for additions
    await this.consumerService.consume(
      { topics: ['addtowishlist', 'userRegistered'] }, //not using userRegistered anymore --mariam 
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value.toString());
            console.log(`Received message from ${topic} topic:`, data);

            // Update the appropriate model based on the topic
            if (topic === 'addtowishlist') {
              await this.wishlistModel.create({
                userid: data.userId,
                productid: data.productId,
                selectedColor: data.selectedColor,
                selectedMaterial: data.selectedMaterial,
                selectedSize: data.selectedSize,
                price: data.totalPrice,
              });
            } else if (topic === 'userRegistered') {
              // Update the Address model
              if (topic === 'userRegistered') {
                await this.addressModel.updateOne(
                  { userid: data.userId },
                  {
                    $set: {
                      apartment: data.apartment,
                      addresslabel: data.addresslabel,
                      email: data.email,
                      floor: data.floor,
                      first_name: data.first_name,
                      street: data.street,
                      building: data.building,
                      phone_number: data.phonenumber,
                      postal_code: data.postal_code,
                      extra_description: data.extra_description,
                      city: data.city,
                      country: data.country,
                      last_name: data.last_name,
                      state: data.state,
                    },
                  },
                  { upsert: true },
                );
              }
            }
          } catch (error) {
            console.error(
              `Error processing message from ${topic} topic:`,
              error,
            );
          }
        },
      },
    );
  }

  async addToWishlist(userId: string, productId: string) {
    try {
      const wishlist = new this.wishlistModel({
        userid: userId,
        productid: productId,
      });

      await wishlist.save();

      return wishlist;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  async getAddress(userId: string) {
    try {
      const address = await this.addressModel.find({ userid: userId }).exec();

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
        apartment: body.apartment,
        addresslabel: body.addresslabel,
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
      const allowedUpdates = [
        'first_name',
        'last_name',
        'phone_number',
        'email',
      ];
      const updates = Object.keys(body);
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update),
      );

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
      const card = await this.paymentModel.find({ userid: userId }).exec();

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

  //getWishlist
  async getWishlist(userId: string) {
    try {
      const wishlist = await this.wishlistModel.find({ userid: userId }).exec();

      if (!wishlist) {
        throw new NotFoundException('wishlist not found');
      }

      return wishlist;
    } catch (error) {
      throw new NotFoundException('wishlist not found');
    }
  }

  // async getAddressByUserId(userId: MongooseSchema.Types.ObjectId) {
  //   return this.addressModel.findOne({ userid: userId }).exec();
  // }
}
