import { Module } from '@nestjs/common';
import { SmtpUtil } from './smtp.util';

@Module({
  providers: [SmtpUtil],
  exports: [SmtpUtil],
})
export class SmtpModule {}
