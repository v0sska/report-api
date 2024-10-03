import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { CustomerController } from './customer.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [CustomerService, CustomerRepository, PrismaService],
  controllers: [CustomerController],
  exports: [CustomerService, CustomerRepository, PrismaService],
})
export class CustomerModule {}
