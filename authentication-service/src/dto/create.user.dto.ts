/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {

  readonly first_name: string;

  readonly last_name: string;

  readonly email: string; // login using email

  readonly phonenumber: string;

  readonly company: string;


  readonly apartment: string;

  readonly floor: string;

  readonly street: string;

  readonly building: string;

  readonly postal_code: string;


  readonly extra_description: string;


  readonly city: string;


  readonly country: string;


  readonly addresslabel: string;


  readonly state: string;

  
// hash password
  readonly password: string;

  
  

  toString(): string {
    return JSON.stringify({
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phonenumber: this.phonenumber,
      company: this.company,
      apartment: this.apartment,
      floor: this.floor,
      street: this.street,
      building: this.building,
      postal_code: this.postal_code,
      extra_description: this.extra_description,
      city: this.city,
      country: this.country,
      addresslabel: this.addresslabel,
      state: this.state,
      password: this.password,
    });
  }
}
