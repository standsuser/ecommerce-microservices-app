import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}