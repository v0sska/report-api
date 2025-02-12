import { Module } from '@nestjs/common';

import { ProjectManagerReportService } from './project-manager-report.service';
import { ProjectManagerReportRepository } from './project-manager-report.repository';
import { ProjectManagerReportController } from './project-manager-report.controller';
import { PrismaService } from '@/database/prisma.service';
import { ProjectManagerModule } from '../project-manager/project-manager.module';

@Module({
  imports: [ProjectManagerModule],
  providers: [
    ProjectManagerReportService,
    ProjectManagerReportRepository,
    PrismaService,
  ],
  controllers: [ProjectManagerReportController],
  exports: [
    ProjectManagerReportService,
    ProjectManagerReportRepository,
    PrismaService,
  ],
})
export class ProjectManagerReportModule {}
