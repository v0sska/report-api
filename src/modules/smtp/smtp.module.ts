import { Module } from '@nestjs/common';
import { EmailService } from './emal.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class SmtpModule {}
