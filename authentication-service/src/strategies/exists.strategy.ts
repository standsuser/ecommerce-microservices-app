/* eslint-disable prettier/prettier */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "../dto/login.dto";
import { UserAlreadyExistsException } from "../exceptions/userAlreadyExists.exception";

@Injectable()
export class ExistsStrategy extends PassportStrategy(Strategy, 'exists') {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, check: boolean): Promise<any> {
    console.log(email, password);

    const user = await this.userService.getUserbyEmail(email);

    if (user) {
      throw new UserAlreadyExistsException();
    }

    return { email, password, check };
  }
}
