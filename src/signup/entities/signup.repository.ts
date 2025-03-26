import { Signup } from './signup.entity';

export interface SignupRepository {
  existsByDocument(document: string): Promise<boolean>;
  save(signup: Signup): Promise<Signup>;
}

export const SignupRepository = Symbol('SignupRepository');
