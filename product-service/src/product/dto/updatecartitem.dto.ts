import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;
}