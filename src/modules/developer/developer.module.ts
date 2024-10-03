import { Module } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { DeveloperRepository } from './developer.repository';
import { DeveloperController } from './developer.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [DeveloperService, DeveloperRepository, PrismaService],
  controllers: [DeveloperController],
  exports: [DeveloperService, DeveloperRepository, PrismaService],
})
export class DeveloperModule {}
