import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
  accountId: string;
}
