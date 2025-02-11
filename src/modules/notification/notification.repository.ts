import { BaseRepository } from '@/common/types/base-repository.type';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { NOTIFICATION_STATUS } from '@/common/constants/notification-status.constants';
import { NOTIFICATION_HIDE_STATUS } from '@/common/constants/notification-hide-status.constants';

import { ClassLoggerService } from '@/common/utils/loger.util';

@Injectable()
export class NotificationRepository extends BaseRepository<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(NotificationRepository.name);
  }

  public async create(dto: CreateNotificationDto): Promise<Notification> {
    return await this.prismaService.notification
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<Notification> {
    return await this.prismaService.notification
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findPendingByReportId(reportId: string): Promise<Notification> {
    return await this.prismaService.notification
      .findFirst({
        where: {
          reportId,
          status: NOTIFICATION_STATUS.PENDING,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByReportId(reportId: string): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        where: {
          reportId,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByFromUserId(fromUserId: string): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        where: {
          fromUserId: fromUserId,
          AND: [
            {
              hideStatus: {
                not: NOTIFICATION_HIDE_STATUS.HIDE_FROM_SENDER,
              },
            },
            {
              hideStatus: {
                not: NOTIFICATION_HIDE_STATUS.HIDE_FROM_BOTH,
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          toUser: true,
          fromUser: true,
          report: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBytoUserId(toUserId: string): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        where: {
          toUserId: toUserId,
          AND: [
            {
              hideStatus: {
                not: NOTIFICATION_HIDE_STATUS.HIDE_FROM_RECEIVER,
              },
            },
            {
              hideStatus: {
                not: NOTIFICATION_HIDE_STATUS.HIDE_FROM_BOTH,
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          toUser: true,
          fromUser: true,
          report: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateNotificationDto,
  ): Promise<Notification> {
    return await this.prismaService.notification
      .update({
        where: {
          id,
        },
        data: updates,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async delete(id: string): Promise<Notification> {
    return await this.prismaService.notification
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
}
