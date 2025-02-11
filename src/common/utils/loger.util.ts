import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

export class ClassLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private className: string) {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}] (${this.className}): ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: `logs/${this.className}.log`,
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message);
    if (trace) {
      this.logger.error(trace);
    }
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
