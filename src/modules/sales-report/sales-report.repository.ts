import { BaseRepository } from '@/common/types/base-repository.type';

import { SalesReport } from '@prisma/client';

import { ClassLoggerService } from '@/common/utils/loger.util';

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
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(SalesReportRepository.name);
  }

  public async create(dto: CreateSalesReportDto): Promise<SalesReport> {
    return await this.prismaService.salesReport
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<SalesReport[]> {
    return await this.prismaService.salesReport.findMany({
      include: {
        sales: {
          include: {
            user: true,
          }
        }
      }
    }).catch((error) => {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<SalesReport> {
    return await this.prismaService.salesReport
      .findUnique({
        where: {
          id,
        },
        include: {
          sales: {
            include: {
              user: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBySalesId(salesId: string): Promise<SalesReport[]> {
    return await this.prismaService.salesReport
      .findMany({
        where: {
          salesId,
        },
        include: {
          sales: {
            include: {
              user: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
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
        this.logger.error(error.message);
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
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
}
