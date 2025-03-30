import { ApiProperty } from '@nestjs/swagger';

export class CreateSigninDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
