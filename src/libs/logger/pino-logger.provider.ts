import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class PinoLoggerProvider implements LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  });

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, { optionalParams });
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, { optionalParams });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, { optionalParams });
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, { optionalParams });
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, { optionalParams });
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.logger.fatal(message, { optionalParams });
  }
}
