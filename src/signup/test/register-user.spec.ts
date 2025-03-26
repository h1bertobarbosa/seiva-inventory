import { CreateSignupDto } from '../dto/create-signup.dto';
import { SignupRepository } from '../entities/signup.repository';
import { RegisterUser } from '../register-user';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { CryptoProvider } from '../../libs/crypto/ports/crypto.provider';
import { Signup } from '../entities/signup.entity';
describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let signupRepository: MockProxy<SignupRepository>;
  let cryptoProvider: MockProxy<CryptoProvider>;
  let input: CreateSignupDto;
  beforeEach(() => {
    signupRepository = mock();
    cryptoProvider = mock();
    registerUser = new RegisterUser(signupRepository, cryptoProvider);
    input = {
      companyDocument: faker.number.hex(14),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      companyName: faker.company.buzzNoun(),
      companyEmail: faker.internet.email(),
    };
  });

  it('deve lançar um erro caso companyDocument já tenha sido cadastrado', async () => {
    signupRepository.existsByDocument.mockResolvedValue(true);
    expect(async () => await registerUser.execute(input)).rejects.toThrow(
      'account already exists',
    );
  });

  it('deve salvar o user e account', async () => {
    const signup = Signup.getInstance(input);

    signupRepository.existsByDocument.mockResolvedValue(false);
    signupRepository.save.mockResolvedValue(
      Signup.getInstance({
        ...input,
        companyId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    );
    cryptoProvider.hash.mockResolvedValue(input.password);
    await registerUser.execute(input);
    expect(cryptoProvider.hash).toHaveBeenCalledWith(input.password);
    expect(signupRepository.save).toHaveBeenCalledWith(signup);
  });
});
