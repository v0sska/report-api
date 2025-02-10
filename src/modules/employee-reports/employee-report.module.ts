import { Module } from '@nestjs/common';

import { EmployeeReportRepository } from './employee-report.repository';
import { EmployeeReportService } from './employee-report.service';
import { PrismaService } from '@/database/prisma.service';
import { EmployeeReportController } from './employee-report.controller';

import { EmployeeModule } from '../employee/employee.module';
import { SalesModule } from '../sales/sales.module';
import { ProjectManagerModule } from '../project-manager/project-manager.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [EmployeeModule, SalesModule, ProjectManagerModule, NotificationModule],
  controllers: [EmployeeReportController],
  providers: [EmployeeReportRepository, EmployeeReportService, PrismaService],
  exports: [EmployeeReportRepository, EmployeeReportService, PrismaService],
})
export class EmployeeReportModule {}
