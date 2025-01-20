import { Module } from '@nestjs/common';
import { SalesModule } from '@/modules/sales/sales.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DbModule } from './database/db.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProjectManagerModule } from './modules/project-manager/project-manager.module';

@Module({
  imports: [
    ProjectManagerModule,
    EmployeeModule,
    SalesModule,
    UserModule,
    AuthModule,
    DbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
