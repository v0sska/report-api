import { Module } from '@nestjs/common';

import { ProjectManagerController } from './project-manager.controller';
import { ProjectManagerRepository } from './project-manager.repository';
import { ProjectManagerService } from './project-manager.service';
import { PrismaService } from '@/database/prisma.service';

@Module({
  imports: [],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerRepository, ProjectManagerService, PrismaService],
  exports: [ProjectManagerRepository, ProjectManagerService, PrismaService],
})
export class ProjectManagerModule {}
