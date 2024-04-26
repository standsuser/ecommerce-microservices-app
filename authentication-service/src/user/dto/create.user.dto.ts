/* eslint-disable prettier/prettier */
export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly company: string;
  readonly address: string;

  toString(): string {
    return JSON.stringify({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      company: this.company,
      address: this.address,
    });
  }
}
