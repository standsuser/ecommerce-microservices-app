import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// import { UserSchema, OrderSchema, PaymentMethodSchema, AddressSchema } from './schema';

@Module({
  imports: [
    // Connect to MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/profile-service'),
    // Register schemas
    // MongooseModule.forFeature([
    //   { name: 'User', schema: UserSchema },
    //   { name: 'Order', schema: OrderSchema },
    //   { name: 'PaymentMethod', schema: PaymentMethodSchema },
    //   { name: 'Address', schema: AddressSchema },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
