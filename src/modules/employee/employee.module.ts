import { Module } from '@nestjs/common';

import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  imports: [],
  providers: [EmployeeRepository, EmployeeService, PrismaService],
  controllers: [EmployeeController],
  exports: [EmployeeRepository, EmployeeService, PrismaService],
})
export class EmployeeModule {}
