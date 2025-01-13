import { BaseRepository } from '@/common/types/base-repository.type';
import { Developer } from '@prisma/client';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { UpdateDeveloperDto } from './dtos/update-developer.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DeveloperRepository extends BaseRepository<
  Developer,
  CreateDeveloperDto,
  UpdateDeveloperDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateDeveloperDto): Promise<Developer> {
    return await this.prismaService.developer
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Developer[]> {
    return await this.prismaService.developer.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<Developer> {
    return await this.prismaService.developer
      .findUnique({
        where: {
          id,
        },
        include: {
          report: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateDeveloperDto,
  ): Promise<Developer> {
    return await this.prismaService.developer
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

  public async delete(id: string): Promise<Developer> {
    return await this.prismaService.developer
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
