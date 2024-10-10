import { BaseRepository } from '@/common/types/base-repository.type';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRepository<
  User | Object,
  CreateUserDto,
  UpdateUserDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.prismaService.user
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<User[]> {
    return await this.prismaService.user.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string) {
  return await this.prismaService.user
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        developer: {
          select: {
            id: true,  
            name: true,
			stack: true,
			telegram: true,
			timeJoin: true,
          },
        },
        sale: {
          select: {
            id: true,
            name: true,
			timeJoin: true,
          },
        },
      },
    })
    .catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
}


  public async update(id: string, updates: UpdateUserDto): Promise<User> {
    return await this.prismaService.user
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

  public async delete(id: string): Promise<User> {
    return await this.prismaService.user
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmail(email: string) {
    return await this.prismaService.user
      .findUnique({
        where: {
          email,
        },
		select: {
        id: true,
        email: true,
		password: true,
        developer: {
          select: {
            id: true,  
            name: true,
			stack: true,
			telegram: true,
			timeJoin: true,
          },
        },
        sale: {
          select: {
            id: true,
            name: true,
			timeJoin: true,
          },
        },
      },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
