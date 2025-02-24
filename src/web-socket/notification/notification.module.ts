import { Module } from '@nestjs/common';

import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationGatewayService } from './notification.gateway.service';

import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    NotificationGateway,
    NotificationService,
    NotificationGatewayService,
  ],
  exports: [
    NotificationGateway,
    NotificationService,
    NotificationGatewayService,
  ],
})
export class NotificationGatewayModule {}
