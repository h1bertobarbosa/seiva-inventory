import { Signup } from '../entities/signup.entity';

describe('Signup Entity', () => {
  it('deve lançar um erro se nao receber um name', () => {
    expect(() =>
      Signup.getInstance({
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyDocument: '',
        companyEmail: '',
      }),
    ).toThrow('name is required');
  });
  it('deve lançar um erro se nao receber um email', () => {
    expect(() =>
      Signup.getInstance({
        name: 'juvenal',
        email: '',
        password: '',
        companyName: '',
        companyDocument: '',
        companyEmail: '',
      }),
    ).toThrow('email is required');
  });
  it('deve lançar um erro se nao receber um password', () => {
    expect(() =>
      Signup.getInstance({
        name: 'juvenal',
        email: 'juvenal@gmail.com',
        password: '',
        companyName: '',
        companyDocument: '',
        companyEmail: '',
      }),
    ).toThrow('password is required');
  });
  it('deve lançar um erro se nao receber um companyName', () => {
    expect(() =>
      Signup.getInstance({
        name: 'juvenal',
        email: 'juvenal@gmail.com',
        password: '123456',
        companyName: '',
        companyDocument: '',
        companyEmail: '',
      }),
    ).toThrow('companyName is required');
  });
  it('deve lançar um erro se nao receber um companyDocument', () => {
    expect(() =>
      Signup.getInstance({
        name: 'juvenal',
        email: 'juvenal@gmail.com',
        password: '123456',
        companyName: 'company A',
        companyDocument: '',
        companyEmail: '',
      }),
    ).toThrow('companyDocument is required');
  });

  it('deve lançar um erro se nao receber um companyEmail', () => {
    expect(() =>
      Signup.getInstance({
        name: 'juvenal',
        email: 'juvenal@gmail.com',
        password: '123456',
        companyName: 'company A',
        companyDocument: '654987321',
        companyEmail: '',
      }),
    ).toThrow('companyEmail is required');
  });
});
