/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  readonly firstname: string;
  readonly lastname: string;
  @IsEmail()
  readonly email: string; //login using email
  readonly phonenumber: string;
  readonly company: string;
  readonly address: string;
  //readonly username: string;
  readonly password: string; //;login using password


  toString(): string {
    return JSON.stringify({
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phonenumber: this.phonenumber,
      company: this.company,
      address: this.address,
      //username: this.username,
      password: this.password,

    });
  }
}
