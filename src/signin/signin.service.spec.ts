import { SigninService } from './signin.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { CryptoProvider } from '../libs/crypto/ports/crypto.provider';
import { JwtService } from '@nestjs/jwt';
describe('SigninService', () => {
  let service: SigninService;
  let userModel: MockProxy<Model<User>>;
  let cryptoProvider: MockProxy<CryptoProvider>;
  let jwtService: MockProxy<JwtService>;
  const signinInput = {
    email: 'juvenal@gmail.com',
    password: 'password',
  };

  beforeEach(async () => {
    userModel = mock();
    cryptoProvider = mock();
    jwtService = mock();
    service = new SigninService(userModel, cryptoProvider, jwtService);
  });

  it('Deve lançar um erro se user não existir', async () => {
    userModel.findOne.mockResolvedValue(null);
    cryptoProvider.compare.mockResolvedValue(false);
    await expect(
      async () => await service.execute(signinInput),
    ).rejects.toThrow('user or password not found');
  });
  it('Deve lançar um erro se a senha estive errada', async () => {
    userModel.findOne.mockResolvedValue({
      email: 'juvenal@gmail.com',
      password: 'password1',
    });
    cryptoProvider.compare.mockResolvedValue(false);
    await expect(
      async () => await service.execute(signinInput),
    ).rejects.toThrow('user or password not found');
    expect(cryptoProvider.compare).toHaveBeenCalledWith(
      signinInput.password,
      'password1',
    );
  });

  it('Deve retornar um JWT se as credenciais estiverem corretas', async () => {
    userModel.findOne.mockResolvedValue({
      email: 'juvenal@gmail.com',
      password: 'password',
    });
    cryptoProvider.compare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');
    const result = await service.execute(signinInput);
    expect(result.accessToken).toBeDefined();
    expect(jwtService.signAsync).toHaveBeenCalled();
  });
});
