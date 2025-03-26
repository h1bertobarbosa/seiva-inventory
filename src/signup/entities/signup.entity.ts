import { ValidationException } from '../../libs/exceptions/domain/validation.exceptions';

export interface InputSignup {
  companyId?: string;
  userId?: string;
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyDocument: string;
  companyEmail: string;
}
export class Signup {
  private constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly companyName: string,
    readonly companyDocument: string,
    readonly companyEmail: string,
    readonly companyId?: string,
    readonly userId?: string,
  ) {
    if (!name) {
      throw new ValidationException('name is required');
    }
    if (!email) {
      throw new ValidationException('email is required');
    }
    if (!password) {
      throw new ValidationException('password is required');
    }
    if (!companyName) {
      throw new ValidationException('companyName is required');
    }
    if (!companyDocument) {
      throw new ValidationException('companyDocument is required');
    }
    if (!companyEmail) {
      throw new ValidationException('companyEmail is required');
    }
  }

  static getInstance(input: InputSignup) {
    return new Signup(
      input.name,
      input.email,
      input.password,
      input.companyName,
      input.companyDocument,
      input.companyEmail,
      input.companyId,
      input.userId,
    );
  }
}
