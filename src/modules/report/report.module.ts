import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { ReportController } from './report.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [ReportService, ReportRepository, PrismaService],
  controllers: [ReportController],
  exports: [ReportService, ReportRepository, PrismaService],
})
export class ReportModule {}
