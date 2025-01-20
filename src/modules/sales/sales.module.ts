import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';
import { SaleController } from './sales.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [SalesService, SalesRepository, PrismaService],
  controllers: [SaleController],
  exports: [SalesService, SalesRepository, PrismaService],
})
export class SalesModule {}
