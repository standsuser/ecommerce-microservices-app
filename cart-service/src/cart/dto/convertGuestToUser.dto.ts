import { IsString } from 'class-validator';

export class ConvertGuestToUserDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly sessionId: string;
}