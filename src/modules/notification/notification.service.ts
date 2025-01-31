import { NotificationRepository } from './notification.repository';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

import { Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class NotificationService {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async create(dto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationRepository.create(dto);
  }

  public async find(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  public async findById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException(EXCEPTION.NOTIFICATION_NOT_FOUND);
    }

    return notification;
  }

  public async findByReportId(reportId: string): Promise<Notification[]> {
    return await this.notificationRepository.findByReportId(reportId);
  }

  public async findByFromUserId(fromUserId: string): Promise<Notification[]> {
    return await this.notificationRepository.findByFromUserId(fromUserId);
  }

  public async findByToUserId(toUserId: string): Promise<Notification[]> {
    return await this.notificationRepository.findBytoUserId(toUserId);
  }

  public async update(
    id: string,
    updates: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.update(id, updates);

    if (!notification) {
      throw new NotFoundException(EXCEPTION.NOTIFICATION_NOT_FOUND);
    }

    return notification;
  }

  public async delete(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.delete(id);

    if (!notification) {
      throw new NotFoundException(EXCEPTION.NOTIFICATION_NOT_FOUND);
    }

    return notification;
  }
}
