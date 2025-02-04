import { Module } from '@nestjs/common';

import { ProjectIncomeController } from './project-income.controller';
import { ProjectIncomeRepository } from './project-income.repository';
import { ProjectIncomeService } from './project-income.service';
import { PrismaService } from '@/database/prisma.service';

@Module({
  controllers: [ProjectIncomeController],
  providers: [ProjectIncomeRepository, ProjectIncomeService, PrismaService],
  exports: [ProjectIncomeRepository, ProjectIncomeService, PrismaService],
})
export class ProjectIncomeModule {}
