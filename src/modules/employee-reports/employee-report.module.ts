import { Module } from '@nestjs/common';

import { EmployeeReportRepository } from './employee-report.repository';
import { EmployeeReportService } from './employee-report.service';
import { PrismaService } from '@/database/prisma.service';
import { EmployeeReportController } from './employee-report.controller';

@Module({
  controllers: [EmployeeReportController],
  providers: [EmployeeReportRepository, EmployeeReportService, PrismaService],
  exports: [EmployeeReportRepository, EmployeeReportService, PrismaService],
})
export class EmployeeReportModule {}
