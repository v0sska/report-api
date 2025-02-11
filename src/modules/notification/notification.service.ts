import { NotificationRepository } from './notification.repository';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { HideNotificationDto } from './dtos/hide-notification.dto';

import { Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { NOTIFICATION_HIDE_STATUS } from '@/common/constants/notification-hide-status.constants';

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

  public async findPendingByReportId(reportId: string): Promise<Notification> {
    return await this.notificationRepository.findPendingByReportId(reportId);
  }

  public async hideNotification(
    dto: HideNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findById(dto.id);

    if (!notification) {
      throw new NotFoundException(EXCEPTION.NOTIFICATION_NOT_FOUND);
    }

    let hideStatus = NOTIFICATION_HIDE_STATUS.NONE;

    if (notification.hideStatus !== NOTIFICATION_HIDE_STATUS.NONE) {
      hideStatus = NOTIFICATION_HIDE_STATUS.HIDE_FROM_BOTH;
    } else if (dto.hideFrom === notification.fromUserId) {
      hideStatus = NOTIFICATION_HIDE_STATUS.HIDE_FROM_SENDER;
    } else if (dto.hideFrom === notification.toUserId) {
      hideStatus = NOTIFICATION_HIDE_STATUS.HIDE_FROM_RECEIVER;
    }

    return await this.notificationRepository.update(dto.id, { hideStatus });
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

  public async isNewNotifications(toUserId: string): Promise<boolean> {
    const notifications = await this.findByToUserId(toUserId);

    return notifications.some((notification) => notification.isNew);
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
