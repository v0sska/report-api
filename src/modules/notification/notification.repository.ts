import { BaseRepository } from '@/common/types/base-repository.type';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class NotificationRepository extends BaseRepository<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateNotificationDto): Promise<Notification> {
    return await this.prismaService.notification
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Notification[]> {
    return await this.prismaService.notification.findMany().catch((error) => {
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
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByFromUserId(fromUserId: string): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        where: {
          fromUserId: fromUserId,
        },
        include: {
          toUser: true,
          fromUser: true,
          report: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBytoUserId(toUserId: string): Promise<Notification[]> {
    return await this.prismaService.notification
      .findMany({
        where: {
          toUserId: toUserId,
        },
        include: {
          toUser: true,
          fromUser: true,
          report: true,
        },
      })
      .catch((error) => {
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
        throw new InternalServerErrorException(error.message);
      });
  }
}
