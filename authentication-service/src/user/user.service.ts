/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../interfaces/user';
import { CreateUserDto } from '../dto/create.user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dto/token.dto';
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExists.exception';
import { Mailservice } from './Mail.service';
import { SessionService } from '../session/session.service';
import { Console } from 'console';
import { async } from 'rxjs';
import { ProducerService } from 'src/kafka/producer.service';


const bcrypt = require("bcrypt");




@Injectable()
export class UserService {
    private mailService: Mailservice;
    private readonly sessionService: SessionService;


    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly producerService: ProducerService,


    ) {
        this.mailService = new Mailservice('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')


    }



    //  async register(CreateUserDto:CreateUserDto){
    //      const createUser= new this.userModel(CreateUserDto)
    //      let saveResult = await createUser.save();
    //      console.log(saveResult)
    //      return saveResult;
    //  }

    async validateUser(loginDto: LoginDto) {
        let loginResult = await this.userModel.findOne({
            username: loginDto.username,
        });

        if (loginResult === null) {
            return null;
        }

        let jsonData = loginResult.toObject();
        let { __v, _id, ...userData } = jsonData;

        return {
            id: jsonData._id,
            ...userData
        }
    }

    async getUserbyUsername(username: string) {
        let loginResult = await this.userModel.findOne({
            username: username,

        });

        if (loginResult === null) {
            return null;
        }
        let jsonData = loginResult.toObject();
        let { __v, _id, ...userData } = jsonData;

        return {
            id: jsonData._id,
            ...userData
        }
    }

    async getUserbyEmail(email: string) {
        let loginResult = await this.userModel.findOne({
            email: email,

        });

        if (loginResult === null) {
            return null;
        }
        let jsonData = loginResult.toObject();
        let { __v, _id, ...userData } = jsonData;

        return {
            id: jsonData._id,
            ...userData
        }
    }

    async getUserbyID(id: string) {
        try {

            let loginResult = await this.userModel.findOne({ _id: id }).exec();

            if (!loginResult) {
                throw new Error("User not found");
            }
            let { __v, ...userData } = loginResult.toObject();

            return {
                id,
                ...userData
            };
        } catch (error) {

            // Handle error appropriately
            console.error("Error fetching user:", error);
            throw new Error("Failed to fetch user");
        }
    }


    //  async findByEmail(email: string): Promise<User> {
    //     const user = await this.userModel.findOne({ email }).exec();
    //     if (!user) {
    //          throw new NotFoundException('User not found');
    //      }
    //      return user;
    //  }

    // async login(user: any) {
    //     //console.log(command)
    //     let payload = {
    //         id: user._id,
    //         name: user.name,
    //         username: user.username,
    //         roles: user.roles

    //     };

    //     var token = this.jwtService.sign(payload);
    //     var tokenvalue: any = this.jwtService.decode(token);


    //     return {
    //         access_token: token,
    //         expires_in: tokenvalue.exp,


    //     };

    // }

    async login(LoginDto: LoginDto) {

        const user = await this.validateUser(LoginDto);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const payload = {
            email: user.email,
            sub: user.id,


        };
        const token = this.jwtService.sign(payload);
        const tokenValue: any = this.jwtService.decode(token);

        return {
            access_token: token,
            expires_in: tokenValue.exp,
            userID: user.id
        };



    }

    async changePassword(userID: string, newPassword: string, oldPassword: string) {
        const user = await this.getUserbyID(userID);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.password !== oldPassword) {
            throw new Error('Old password is incorrect');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate({ userId: user._id }, { password: newPassword }).exec();
        Logger.log(updatedUser, 'User updated');

        return updatedUser;
    }

    
    validateToken(jwt: string) {
        const validatedToken = this.jwtService.sign(jwt);
        return validatedToken;
    }



    // async register(createUserDto: CreateUserDto): Promise<User> {
    //     const existingUser = await this.getUserbyEmail(createUserDto.email);
    //     Logger.log('ex', existingUser);
    //     if (existingUser) {
    //         throw new UserAlreadyExistsException();
    //     }

    //     // Create a new User document using the Mongoose model
    //     const newUser = new this.userModel(createUserDto);

    //     Logger.log(newUser);
    //     // Save the new user
    //     const savedUser = await newUser.save() as User;

    //     // Send verification email
    //     await this.sendVerificationEmail(savedUser.email);

    //     console.log("User saved and verification email sent");

    //     return savedUser;
    // }
    

    // async register(createUserDto: CreateUserDto): Promise<User> {
    //     const existingUser = await this.getUserbyEmail(createUserDto.email);
    //     Logger.log('ex', existingUser);
    //     if (existingUser) {
    //         throw new UserAlreadyExistsException();
    //     }
      
    //     // Create a new User document using the Mongoose model
    //     const newUser = new this.userModel(createUserDto);
      
    //     Logger.log(newUser);
    //     // Save the new user
    //     const savedUser = await newUser.save() as User;
      
    //     // Send verification email
    //     await this.sendVerificationEmail(savedUser.email);
      
    //     console.log("User saved and verification email sent");
      
    //     // Prepare the record for Kafka
    //     const record = {
    //       topic: 'userRegistered',
    //       messages: [
    //         {
    //           value: JSON.stringify({
    //             userId: savedUser._id,
    //             email: savedUser.email,
    //             name: savedUser.name,
    //             // Add other fields from the createUserDto as needed
    //             eventType: 'UserRegistered',
    //           }),
    //         },
    //       ],
    //     };
      
    //     // Send the record to Kafka
    //     await this.producerService.produce(record);
      
    //     return savedUser;
    //   }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.getUserbyEmail(createUserDto.email);
        Logger.log('ex', existingUser);
        if (existingUser) {
            throw new UserAlreadyExistsException();
        }
      
        // Create a new User document using the Mongoose model
        // const newUser = new this.userModel(createUserDto);

        //hash the password



        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = new this.userModel({
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          email: createUserDto.email,
          phonenumber: createUserDto.phonenumber,
          company: createUserDto.company,
          apartment: createUserDto.apartment,
          floor: createUserDto.floor,
          street: createUserDto.street,
          building: createUserDto.building,
          postal_code: createUserDto.postal_code,
          extra_description: createUserDto.extra_description,
          city: createUserDto.city,
          country: createUserDto.country,
          addresslabel: createUserDto.addresslabel,
          state: createUserDto.state,
          password: hashedPassword,
        });

        Logger.log(newUser);
        // Save the new user
        const savedUser = await newUser.save() as User;
      
        // Send verification email
        await this.sendVerificationEmail(savedUser.email);
      
        console.log("User saved and verification email sent");
      
        // Prepare the record for Kafka
        const record = {
          topic: 'userRegistered',
          messages: [
            {
              value: JSON.stringify({
                userId: savedUser._id,
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                email: createUserDto.email,
                phonenumber: createUserDto.phonenumber,
                company: createUserDto.company,
                apartment: createUserDto.apartment,
                floor: createUserDto.floor,
                street: createUserDto.street,
                building: createUserDto.building,
                postal_code: createUserDto.postal_code,
                extra_description: createUserDto.extra_description,
                city: createUserDto.city,
                country: createUserDto.country,
                addresslabel: createUserDto.addresslabel,
                state: createUserDto.state,
                password: createUserDto.password,
                eventType: 'UserRegistered',
              }),
            },
          ],
        };
      
        // Send the record to Kafka
        await this.producerService.produce(record);
      
        return savedUser;
      }


    private async sendVerificationEmail(email: string): Promise<void> {
        const verificationLink = `http://localhost:5050/login`;
        const mailOptions = {
            from: 'omarx10050@gmail.com', // Sender email address
            to: email,
            subject: 'Verify Your Email Address',
            text: `Please click on the following link to verify your email address: ${verificationLink}`,
        };

        try {
            await this.mailService.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    async forgetPassword(email: string): Promise<void> {
        const existingUser = await this.getUserbyEmail(email);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Send password reset email
        await this.sendPasswordResetEmail(email);

        console.log("Password reset email sent");
    }

    private async sendPasswordResetEmail(email: any): Promise<void> {
        const resetLink = `https://yourwebsite.com/reset-password/${encodeURIComponent(email)}`;
        const mailOptions = {
            from: 'omarx10050@gmail.com', // Sender email address
            to: email,
            subject: 'Reset Your Password',
            text: `Please click on the following link to reset your password: ${resetLink}`,
        };

        try {
            await this.mailService.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }




}
