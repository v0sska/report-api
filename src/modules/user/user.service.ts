import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  public async find(): Promise<User[]> {
    return await this.userRepository.find();
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
