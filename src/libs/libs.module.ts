import { Module } from '@nestjs/common';
import { BcryptCryptoProvider } from './crypto/adapters/bcrypt-crypto-provider';
import { CryptoProvider } from './crypto/ports/crypto.provider';

@Module({
  providers: [
    {
      provide: CryptoProvider,
      useClass: BcryptCryptoProvider,
    },
  ],
  exports: [CryptoProvider],
})
export class LibsModule {}
