import { BaseRepository } from '@/common/types/base-repository.type';
import { Sale } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SaleRepository extends BaseRepository<
  Sale,
  CreateSaleDto,
  UpdateSaleDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateSaleDto): Promise<Sale> {
    return await this.prismaService.sale
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Sale[]> {
    return await this.prismaService.sale.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<Sale> {
    return await this.prismaService.sale
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(id: string, updates: UpdateSaleDto): Promise<Sale> {
    return await this.prismaService.sale
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

  public async delete(id: string): Promise<Sale> {
    return await this.prismaService.sale
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