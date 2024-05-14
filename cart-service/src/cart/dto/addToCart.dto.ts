import { IsOptional, IsString, IsNumber } from 'class-validator';

export class AddToCartDto {
    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    session_id?: string;

    @IsString()
    item_id: string;

    @IsNumber()
    quantity?: number;

    @IsString()
    name: string;

    @IsNumber()
    amount_cents: number;

    @IsString()
    description: string;

    @IsString()
    color: string;

    @IsString()
    size: string;

    @IsString()
    material: string;
}
