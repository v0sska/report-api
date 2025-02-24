import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { Notification } from '@prisma/client';

import { MESSAGES } from '@/common/constants/messages.contants';

import { NotificationGatewayService } from './notification.gateway.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  public constructor(
    private readonly notificationService: NotificationGatewayService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      client.data.userId = userId;
      const userExists = await this.notificationService.checkUser(userId);

      if (!userExists) {
        client.disconnect();
        return;
      }
      console.log(`User connected with ID: ${userId}`);
      client.join(userId);
      this.server.to(userId).emit('userConnected', userId);
    } else {
      console.log('User connected without userId');
    }
  }

  handleDisconnect(client: Socket): void {
    this.server
      .to(client.data.userId)
      .emit('userDisconnected', client.data.userId);
    console.log(`User with ID ${client.data.userId} disconnected`);
  }

  sendNotification(notification: Notification, userId: string): void {
    if (userId) {
      this.server.to(userId).emit('notification', {
        message: MESSAGES.FETCHED,
        data: notification,
      });
    } else {
      this.server.emit('notification', notification);
    }
  }
}
