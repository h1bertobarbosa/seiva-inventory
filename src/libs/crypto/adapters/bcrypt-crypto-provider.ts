import { CryptoProvider } from '../ports/crypto.provider';
import * as bcrypt from 'bcrypt';
export class BcryptCryptoProvider implements CryptoProvider {
  private SALT = 10;
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
