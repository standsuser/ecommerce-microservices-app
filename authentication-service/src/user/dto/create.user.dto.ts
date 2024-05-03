/* eslint-disable prettier/prettier */
export class CreateUserDto {
  readonly name: string;
  readonly username: string;
  readonly password: string;
 

  toString(): string {
    return JSON.stringify({
      name: this.name,
      username: this.username,
      password: this.password,
    
    });
  }
}
