import { BaseRepository } from '@/common/types/base-repository.type';
import { WorkAccount } from '@prisma/client';
import { CreateWorkAccountDto } from './dtos/create-workaccount.dto';
import { UpdateWorkAccountDto } from './dtos/update-workaccount.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class WorkAccountRepository extends BaseRepository<
  WorkAccount,
  CreateWorkAccountDto,
  UpdateWorkAccountDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateWorkAccountDto): Promise<WorkAccount> {
    return await this.prismaService.workAccount
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<WorkAccount[]> {
    return await this.prismaService.workAccount
      .findMany({
        include: {
          customer: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<WorkAccount> {
    return await this.prismaService.workAccount
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateWorkAccountDto,
  ): Promise<WorkAccount> {
    return await this.prismaService.workAccount
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

  public async delete(id: string): Promise<WorkAccount> {
    return await this.prismaService.workAccount
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBySaleId(saleId: string): Promise<WorkAccount[]> {
    return await this.prismaService.workAccount
      .findMany({
        where: {
          saleId,
        },
        include: {
          customer: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
