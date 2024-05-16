import { IsNotEmpty, IsString } from 'class-validator';

export class ConvertGuestToUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  sessionId: string;
}