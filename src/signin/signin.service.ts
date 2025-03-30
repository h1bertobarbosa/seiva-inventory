import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSigninDto } from './dto/create-signin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { CryptoProvider } from '../libs/crypto/ports/crypto.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SigninService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CryptoProvider) private cryptoProvider: CryptoProvider,
    private jwtService: JwtService,
  ) {}
  async execute(createSigninDto: CreateSigninDto) {
    const user = await this.userModel.findOne({
      email: createSigninDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('user or password not found');
    }

    const passwordMatch = await this.cryptoProvider.compare(
      createSigninDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('user or password not found');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user._id,
        email: user.email,
        accountId: user.accountId,
      }),
    };
  }
}
