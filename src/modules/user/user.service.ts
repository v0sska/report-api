import { UserRepository } from './user.repository';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { EmailService } from '../smtp/emal.service';

import { User } from '@prisma/client';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { userMapper } from '@/common/utils/user-mapper.util';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { USER_STATUS } from '@/common/constants/user-status.constants';

import config from '@/common/configs';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
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

    const inviteUrl = `${config.server.frontendUrl}?token=${inviteToken}`;

    await this.emailService.sendInviteEmail(
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

  public async findById(
    id: string,
  ): Promise<Omit<User, 'password' | 'inviteToken' | 'status' | 'salary'>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async findMe(id: string): Promise<Object> {
    const user = await this.userRepository.findMe(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async adminFindUserById(
    id: string,
    adminRole: string,
  ): Promise<Object> {
    const user = await this.userRepository.adminFindUserById(id, adminRole);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }

  public async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  public async update(id: string, updates: UpdateUserDto): Promise<User> {
    const userForUpdate = await this.userRepository.findByIdForUpdate(id);

    if (!userForUpdate) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    if (updates.password) {
      const decryptPassword = CryptoUtil.decrypt(userForUpdate.password);

      if (decryptPassword === updates.password) {
        throw new BadRequestException(EXCEPTION.PASSWORD_SAME);
      }

      updates.password = CryptoUtil.encrypt(updates.password);
    }

    return await this.userRepository.update(id, updates);
  }

  public async delete(id: string): Promise<User> {
    const user = await this.userRepository.delete(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    return user;
  }
}
