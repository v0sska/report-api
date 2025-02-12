import { Module } from '@nestjs/common';

import { SalesReportService } from './sales-report.service';
import { SalesReportRepository } from './sales-report.repository';
import { SalesReportController } from './sales-report.controller';
import { PrismaService } from '@/database/prisma.service';

import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [SalesModule],
  providers: [SalesReportService, SalesReportRepository, PrismaService],
  controllers: [SalesReportController],
  exports: [SalesReportService, SalesReportRepository, PrismaService],
})
export class SalesReportModule {}
