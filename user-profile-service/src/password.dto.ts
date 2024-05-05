import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @MinLength(8, { message: 'Current password must be at least 8 characters long' })
    readonly currentPassword: string;

    @IsString()
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    readonly newPassword: string;

    toString() {
        return JSON.stringify({
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
        });
    }
}
