import { ApiProperty } from '@nestjs/swagger';

export class CreateSignupDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  companyDocument: string;
  @ApiProperty()
  companyEmail: string;
}
