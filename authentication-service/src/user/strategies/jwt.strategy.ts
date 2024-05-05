
import { ExtractJwt,Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable} from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
constructor(private readonly userService:UserService){
    super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration:false,
        secretOrKey:'Mado451880',
    });
}
async validate(payload: any):Promise<any>{
    console.log(payload);//from jwt token

    
    return payload;
}
}