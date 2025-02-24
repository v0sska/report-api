import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/modules/user/user.repository';

@Injectable()
export class NotificationGatewayService {
  public constructor(private readonly userService: UserRepository) {}

  public async checkUser(userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);

    if (!user) {
      return false;
    }

    return true;
  }
}
