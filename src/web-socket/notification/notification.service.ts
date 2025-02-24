import { Injectable } from '@nestjs/common';

import { NotificationGateway } from './notification.gateway';

import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  public constructor(
    private readonly notificationGateway: NotificationGateway,
  ) {}

  public async sendReportNotification(
    notification: Notification,
    client?: any,
  ) {
    this.notificationGateway.sendNotification(notification, client);
  }
}
