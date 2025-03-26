import { Controller, Post, Body } from '@nestjs/common';
import { CreateSignupDto } from './dto/create-signup.dto';
import { RegisterUser } from './register-user';
import { ApiOkResponse } from '@nestjs/swagger';
import { OutputSignupDto } from './dto/output-signup.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: RegisterUser) {}

  @Post()
  @ApiOkResponse({ type: OutputSignupDto })
  async create(@Body() createSignupDto: CreateSignupDto) {
    return this.signupService.execute(createSignupDto);
  }
}
