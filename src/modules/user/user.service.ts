import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';
import { userMapper } from '@/common/utils/user-mapper.util';
import { USER_STATUS } from '@/common/constants/user-status.constants';
import config from '@/common/configs';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { SmtpUtil } from '@/modules/smtp/smtp.util';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly smtpUtil: SmtpUtil,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  public async createWithInvite(
    dto: CreateUserDto,
  ): Promise<User & { inviteUrl: string }> {
    const inviteToken = CryptoUtil.generateUUID();
    const user = await this.userRepository.create({
      ...dto,
      status: USER_STATUS.PENDING,
      inviteToken: inviteToken,
    });

    const inviteUrl = `${config.server.frontendUrl}/login-via-invitation?token=${inviteToken}`;

    await this.smtpUtil.sendInviteEmail(
      dto.email,
      'Invitation to join the team',
      dto.role,
      inviteUrl,
    );

    return {
      ...user,
      inviteUrl: inviteUrl,
    };
  }

  public async find(): Promise<Omit<User, 'password' | 'inviteToken'>[]> {
    const users = await this.userRepository.find();

    const mappedUsers = users.map((user) => {
      return userMapper(user);
    });

    return mappedUsers;
  }

  public async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async update(id: string, updates: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, updates);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async delete(id: string): Promise<User> {
    const user = await this.userRepository.delete(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}
