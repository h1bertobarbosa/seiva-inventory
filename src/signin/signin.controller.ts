import { Controller, Post, Body } from '@nestjs/common';
import { SigninService } from './signin.service';
import { CreateSigninDto } from './dto/create-signin.dto';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Public()
@Controller('signin')
@ApiTags('Signin')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post()
  create(@Body() createSigninDto: CreateSigninDto) {
    return this.signinService.execute(createSigninDto);
  }
}
