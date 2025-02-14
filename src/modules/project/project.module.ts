import { Module } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { ProjectController } from './project.controller';
import { PrismaService } from '@/database/prisma.service';
import { EmployeeModule } from '../employee/employee.module';
import { SalesModule } from '../sales/sales.module';
import { ProjectManagerModule } from '../project-manager/project-manager.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EmployeeModule, SalesModule, ProjectManagerModule, UserModule],
  providers: [ProjectService, ProjectRepository, PrismaService],
  controllers: [ProjectController],
  exports: [ProjectService, ProjectRepository, PrismaService],
})
export class ProjectModule {}
