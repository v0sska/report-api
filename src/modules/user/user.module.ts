import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PrismaService } from '@/database/prisma.service';
import { EmailService } from '../smtp/emal.service';

import { SmtpModule } from '../smtp/smtp.module';

@Module({
  imports: [SmtpModule],
  providers: [UserService, UserRepository, PrismaService, EmailService],
  controllers: [UserController],
  exports: [UserService, UserRepository, PrismaService, EmailService],
})
export class UserModule {}
