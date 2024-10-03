import { Module } from '@nestjs/common';
import { ReportModule } from '@/modules/report/report.module';
import { CustomerModule } from '@/modules/customer/customer.module';
import { WorkAccountModule } from '@/modules/workaccount/workaccount.module';
import { SaleModule } from '@/modules/sale/sale.module';
import { DeveloperModule } from '@/modules/developer/developer.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ReportModule,
    CustomerModule,
    WorkAccountModule,
    SaleModule,
    DeveloperModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
