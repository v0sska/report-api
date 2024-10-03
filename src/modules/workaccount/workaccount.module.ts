import { Module } from '@nestjs/common';
import { WorkAccountService } from './workaccount.service';
import { WorkAccountRepository } from './workaccount.repository';
import { WorkAccountController } from './workaccount.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [WorkAccountService, WorkAccountRepository, PrismaService],
  controllers: [WorkAccountController],
  exports: [WorkAccountService, WorkAccountRepository, PrismaService],
})
export class WorkAccountModule {}
