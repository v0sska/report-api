import { Module } from '@nestjs/common';
import {DevelopersOnCustomersService} from './developers-on-customers.service';
import { DevelopersOnCustomersRepository } from './developers-on-customers.repository';
import {DevelopersOnCustomersController} from './developers-on-customers.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [DevelopersOnCustomersService, DevelopersOnCustomersRepository, PrismaService],
  controllers: [DevelopersOnCustomersController],
  exports: [DevelopersOnCustomersService, DevelopersOnCustomersRepository, PrismaService],
})
export class DevelopersOnCustomersModule {}
