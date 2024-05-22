/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../interfaces/user';
import { CreateUserDto } from '../dto/create.user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExists.exception';
import { Mailservice } from './Mail.service';
import { SessionService } from '../session/session.service';
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

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    const { __v, _id, ...userData } = user.toObject();
    return { id: _id, ...userData };
  }

  async getUserbyEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    const { __v, _id, ...userData } = user.toObject();
    return { id: _id, ...userData };
  }

  async getUserbyID(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const { __v, ...userData } = user.toObject();
      return { id, ...userData };
    } catch (error) {
      Logger.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    const tokenValue: any = this.jwtService.decode(token);
    return { access_token: token, expires_in: tokenValue.exp, userID: user.id };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.getUserbyEmail(createUserDto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await newUser.save() as User;
    await this.sendVerificationEmail(savedUser.email);
    await this.sendUserRegisteredEvent(savedUser);
    return savedUser;
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    const verificationLink = `http://localhost:5050/login`;
    const mailOptions = {
      from: 'omarx10050@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Please click on the following link to verify your email address: ${verificationLink}`,
    };
    try {
      await this.mailService.sendMail(mailOptions);
    } catch (error) {
      Logger.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async forgetPassword(email: string): Promise<void> {
    const existingUser = await this.getUserbyEmail(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.sendPasswordResetEmail(email);
  }

  private async sendPasswordResetEmail(email: string): Promise<void> {
    const resetLink = `https://yourwebsite.com/reset-password/${encodeURIComponent(email)}`;
    const mailOptions = {
      from: 'omarx10050@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `Please click on the following link to reset your password: ${resetLink}`,
    };
    try {
      await this.mailService.sendMail(mailOptions);
    } catch (error) {
      Logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  private async sendUserRegisteredEvent(user: User): Promise<void> {
    const record = {
      topic: 'userRegistered',
      messages: [
        {
          value: JSON.stringify({
            userId: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            // Add other fields as needed
            eventType: 'UserRegistered',
          }),
        },
      ],
    };
    await this.producerService.produce(record);
  }

  validateToken(jwt: string) {
    const validatedToken = this.jwtService.verify(jwt);
    return validatedToken;
  }
}
