import { Module } from '@nestjs/common';
import { SalesReportModule } from '@/modules/sales-report/sales-report.module';

import { ProjectManagerReportModule } from '@/modules/project-manager-report/project-manager-report.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { ProjectModule } from '@/modules/project/project.module';
import { SalesModule } from '@/modules/sales/sales.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProjectManagerModule } from './modules/project-manager/project-manager.module';
import { EmployeeReportModule } from './modules/employee-reports/employee-report.module';
import { ProjectIncomeModule } from './modules/project-income/project-income.module';

@Module({
  imports: [
    SalesReportModule,
    ProjectManagerReportModule,
    ProjectIncomeModule,
    NotificationModule,
    EmployeeReportModule,
    ProjectModule,
    ProjectManagerModule,
    EmployeeModule,
    SalesModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
