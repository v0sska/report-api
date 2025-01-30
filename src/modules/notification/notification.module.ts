import { Module } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { NotificationController } from './notification.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [NotificationService, NotificationRepository, PrismaService],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationRepository, PrismaService],
})
export class NotificationModule {}
