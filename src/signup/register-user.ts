import { Inject, Injectable } from '@nestjs/common';
import { SignupRepository } from './entities/signup.repository';
import { CreateSignupDto } from './dto/create-signup.dto';
import { ValidationException } from '../libs/exceptions/domain/validation.exceptions';
import { CryptoProvider } from '../libs/crypto/ports/crypto.provider';
import { Signup } from './entities/signup.entity';
import { OutputSignupDto } from './dto/output-signup.dto';

@Injectable()
export class RegisterUser {
  constructor(
    @Inject(SignupRepository) private signupRepository: SignupRepository,
    @Inject(CryptoProvider) private cryptoProvider: CryptoProvider,
  ) {}
  async execute(input: CreateSignupDto): Promise<OutputSignupDto> {
    const accountExists = await this.signupRepository.existsByDocument(
      input.companyDocument,
    );
    if (accountExists) {
      throw new ValidationException('account already exists');
    }

    const password = await this.cryptoProvider.hash(input.password);
    const signup = Signup.getInstance({
      ...input,
      password,
    });
    const savedSignup = await this.signupRepository.save(signup);
    return OutputSignupDto.fromSignup(savedSignup);
  }
}
