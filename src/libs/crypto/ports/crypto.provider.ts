export interface CryptoProvider {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const CryptoProvider = Symbol('CryptoProvider');
