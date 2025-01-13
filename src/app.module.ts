import { Module } from '@nestjs/common';
import { DevelopersOnCustomersModule } from '@/modules/developers-on-customers/developers-on-customers.module';
import { ReportModule } from '@/modules/report/report.module';
import { CustomerModule } from '@/modules/customer/customer.module';
import { WorkAccountModule } from '@/modules/workaccount/workaccount.module';
import { SaleModule } from '@/modules/sale/sale.module';
import { DeveloperModule } from '@/modules/developer/developer.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DbModule } from './database/db.module';

@Module({
  imports: [
    DevelopersOnCustomersModule,
    ReportModule,
    CustomerModule,
    WorkAccountModule,
    SaleModule,
    DeveloperModule,
    UserModule,
    AuthModule,
    DbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
