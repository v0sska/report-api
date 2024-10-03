import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleRepository } from './sale.repository';
import { SaleController } from './sale.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [SaleService, SaleRepository, PrismaService],
  controllers: [SaleController],
  exports: [SaleService, SaleRepository, PrismaService],
})
export class SaleModule {}
