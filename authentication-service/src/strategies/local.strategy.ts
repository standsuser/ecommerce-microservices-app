import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "../dto/login.dto";
import { UserNotFoundException } from "../exceptions/userNotfound.exception";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('validate:', email, password);

    const user = await this.userService.validateUser(email, password);

    if (!user || user === null) {
      throw new UserNotFoundException();
    }
    console.log('validated user:', user);
    return user;
  }
}
