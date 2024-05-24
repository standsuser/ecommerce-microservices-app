import { Inject, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../interfaces/user';
import { CreateUserDto } from '../dto/create.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExists.exception';
import { Mailservice } from './Mail.service';
import { SessionService } from '../session/session.service';
import { ProducerService } from 'src/kafka/producer.service';
import { Types } from 'mongoose';

const bcrypt = require("bcrypt");


@Injectable()
export class UserService {
    private mailService: Mailservice;
    private readonly sessionService: SessionService;
    private otpStore: Map<string, { otp: string, expires: Date, userData: CreateUserDto }> = new Map();

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

    async register(createUserDto: CreateUserDto): Promise<void> {
        const existingUser = await this.getUserbyEmail(createUserDto.email);
        if (existingUser) {
            throw new UserAlreadyExistsException();
        }

        const otp = this.generateOtp();
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 15); // OTP valid for 15 minutes

        this.otpStore.set(createUserDto.email, { otp, expires: otpExpiration, userData: createUserDto });
        await this.sendOtpEmail(createUserDto.email, otp);
    }

    private async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: 'omarx10050@gmail.com',
            to: email,
            subject: 'Verify Your Email Address',
            text: `Your OTP code is: ${otp}. Please use this code to complete your registration.`,
        };
        try {
            await this.mailService.sendMail(mailOptions);
        } catch (error) {
            Logger.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP email');
        }
    }

    async confirmOtp(email: string, otp: string): Promise<User> {
        const storedOtpData = this.otpStore.get(email);

        if (!storedOtpData) {
            throw new Error('No OTP found for this email');
        }

        const { otp: storedOtp, expires, userData } = storedOtpData;

        if (new Date() > expires) {
            this.otpStore.delete(email);
            throw new Error('OTP has expired');
        }

        if (storedOtp !== otp) {
            throw new Error('Invalid OTP');
        }

        // OTP is valid, proceed with user registration
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new this.userModel({
            ...userData,
            password: hashedPassword,
        });
        const savedUser = await newUser.save() as User;

        await this.sendUserRegisteredEvent(savedUser);
        this.otpStore.delete(email);
        return savedUser;
    }

    private async sendUserRegisteredEvent(user: User): Promise<void> { //not used anymore
        const record = {
            topic: 'userRegistered',
            messages: [
                {
                    value: JSON.stringify({
                        userId: user._id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
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

    async updatePassword(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userModel.updateOne({ email }, { password: hashedPassword }).exec();

        return "Password updated successfully" ;
    }

  async updateUserProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

    async forgetPassword(email: string , otp: string , newPassword: string): Promise<void> {
        const existingUser = await this.getUserbyEmail(email);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        if (!await this.verifyOtp(email, otp)) {
            throw new Error('Invalid OTP');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.updateOne({
            email,
        }, {
            password: hashedPassword,
        }).exec();
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        const otp = this.generateOtp();
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 15); // OTP valid for 15 minutes

        this.otpStore.set(email, {
            otp, expires: otpExpiration,
            userData: new CreateUserDto
        });
        const resetLink = `http://localhost:5050/forgetPassword`;
        const mailOptions = {
            from: 'omarx10050@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `Your OTP code is: ${otp} . Please click on the following link to reset your password: ${resetLink}`,
        };
        try {
            await this.mailService.sendMail(mailOptions);
        } catch (error) {
            Logger.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    async resendOtp(email: string): Promise<void> {
        const userOtpData = this.otpStore.get(email);
        
        if (!userOtpData) {
            throw new Error('No OTP found for this email');
        }

        const newOtp = this.generateOtp();
        const newOtpExpiration = new Date();
        newOtpExpiration.setMinutes(newOtpExpiration.getMinutes() + 15); // OTP valid for 15 minutes

        this.otpStore.set(email, { ...userOtpData, otp: newOtp, expires: newOtpExpiration });
        await this.sendOtpEmail(email, newOtp);
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async verifyOtp(email: string, otp: string): Promise<boolean> {
        const storedOtpData = this.otpStore.get(email);

        if (!storedOtpData) {
            throw new Error('No OTP found for this email');
        }

        const { otp: storedOtp, expires } = storedOtpData;

        if (new Date() > expires) {
            this.otpStore.delete(email);
            throw new Error('OTP has expired');
        }

        if (storedOtp !== otp) {
            throw new Error('Invalid OTP');
        }

        // OTP is valid
        this.otpStore.delete(email);
        return true;
    }

    async editProfile(userId: string, body: any) {
        try {
          const allowedUpdates = ['first_name', 'last_name', 'phone_number', 'email'];
          const updates = Object.keys(body);
          const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
          if (!isValidOperation) {
            throw new BadRequestException('Invalid updates!');
          }
      
          const updateData = {};
          for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
              updateData[key] = body[key];
            }
          }
      
          const updateResult = await this.userModel.updateOne({ _id: new Types.ObjectId(userId) }, { $set: updateData }).exec();
      
          if (updateResult.modifiedCount === 0) {
            throw new NotFoundException('Profile not found');
          }
      
          const updatedProfile = await this.userModel.findById(new Types.ObjectId(userId)).exec();
          if (!updatedProfile) {
            throw new NotFoundException('Profile not found');
          }
      
          return updatedProfile;
        } catch (error) {
          throw new NotFoundException('Profile not found');
        }
      }
}
