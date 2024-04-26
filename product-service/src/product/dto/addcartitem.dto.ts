import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddCartItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}