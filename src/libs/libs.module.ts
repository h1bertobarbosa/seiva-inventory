import { Module } from '@nestjs/common';
import { BcryptCryptoProvider } from './crypto/adapters/bcrypt-crypto-provider';
import { CryptoProvider } from './crypto/ports/crypto.provider';
import { LOGGER_PROVIDER } from './logger/logger-provider.const';
import { PinoLoggerProvider } from './logger/pino-logger.provider';

@Module({
  providers: [
    {
      provide: CryptoProvider,
      useClass: BcryptCryptoProvider,
    },
    {
      provide: LOGGER_PROVIDER,
      useClass: PinoLoggerProvider,
    },
  ],
  exports: [CryptoProvider, LOGGER_PROVIDER],
})
export class LibsModule {}
