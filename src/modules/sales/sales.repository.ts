import { BaseRepository } from '@/common/types/base-repository.type';

import { Sales } from '@prisma/client';

import { CreateSalesDto } from './dtos/create-sales.dto';
import { UpdateSalesDto } from './dtos/update-sales.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SalesRepository extends BaseRepository<
  Sales,
  CreateSalesDto,
  UpdateSalesDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateSalesDto): Promise<Sales> {
    return await this.prismaService.sales
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Sales[]> {
    return await this.prismaService.sales.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<Sales> {
    return await this.prismaService.sales
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByUserId(userId: string): Promise<Sales> {
    return await this.prismaService.sales
      .findUnique({
        where: {
          userId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(id: string, updates: UpdateSalesDto): Promise<Sales> {
    return await this.prismaService.sales
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

  public async delete(id: string): Promise<Sales> {
    return await this.prismaService.sales
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
