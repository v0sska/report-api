import { Module } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { ProjectController } from './project.controller';
import { PrismaService } from '@/database/prisma.service';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule],
  providers: [ProjectService, ProjectRepository, PrismaService],
  controllers: [ProjectController],
  exports: [ProjectService, ProjectRepository, PrismaService],
})
export class ProjectModule {}
