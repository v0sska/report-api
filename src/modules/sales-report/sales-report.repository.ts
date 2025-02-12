import { BaseRepository } from '@/common/types/base-repository.type';

import { SalesReport } from '@prisma/client';

import { CreateSalesReportDto } from './dtos/create-sales-report.dto';
import { UpdateSalesReportDto } from './dtos/update-sales-report.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SalesReportRepository extends BaseRepository<
  SalesReport,
  CreateSalesReportDto,
  UpdateSalesReportDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateSalesReportDto): Promise<SalesReport> {
    return await this.prismaService.salesReport
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<SalesReport[]> {
    return await this.prismaService.salesReport.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<SalesReport> {
    return await this.prismaService.salesReport
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBySalesId(salesId: string): Promise<SalesReport[]> {
    return await this.prismaService.salesReport
      .findMany({
        where: {
          salesId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateSalesReportDto,
  ): Promise<SalesReport> {
    return await this.prismaService.salesReport
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

  public async delete(id: string): Promise<SalesReport> {
    return await this.prismaService.salesReport
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
