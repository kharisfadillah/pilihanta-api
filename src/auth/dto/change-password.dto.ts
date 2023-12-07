import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Kata sandi minimal 6 karakter',
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Kata sandi minimal 6 karakter',
  })
  confirmPassword: string;
}
