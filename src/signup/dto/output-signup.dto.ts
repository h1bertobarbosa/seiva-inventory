import { ApiProperty } from '@nestjs/swagger';
import { Signup } from '../entities/signup.entity';

export class OutputSignupDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  companyDocument: string;
  @ApiProperty()
  companyEmail: string;

  static fromSignup(signup: Signup) {
    return {
      id: signup.userId,
      name: signup.name,
      email: signup.email,
      companyName: signup.companyName,
      companyDocument: signup.companyDocument,
      companyEmail: signup.companyEmail,
    };
  }
}
