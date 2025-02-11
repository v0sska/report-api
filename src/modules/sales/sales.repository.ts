import { BaseRepository } from '@/common/types/base-repository.type';

import { Sales } from '@prisma/client';

import { CreateSalesDto } from './dtos/create-sales.dto';
import { UpdateSalesDto } from './dtos/update-sales.dto';
import { SalesStatiscticResponseDto } from './dtos/reponse/sale-statistic-response.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { INCOME_STATUS } from '@/common/constants/income-status.constants';

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
    return await this.prismaService.sales
      .findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<Sales> {
    return await this.prismaService.sales
      .findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
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

  public async getSalesStatistic(): Promise<SalesStatiscticResponseDto> {
    return await this.prismaService
      .$transaction(async (tx) => {
        const sales = await tx.sales.findMany({
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
                employeeReport: {
                  select: {
                    projectIncome: {
                      where: {
                        status: INCOME_STATUS.ACCEPTED,
                      },
                      select: {
                        amount: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const formattedSales = sales.map((sale) => {
          const projects = sale.project.map((project) => {
            const amount = project.employeeReport.reduce((sum, report) => {
              return sum + (report.projectIncome?.amount || 0);
            }, 0);

            return {
              id: project.id,
              name: project.name,
              amount: amount,
            };
          });

          const projectAmountSum = projects.reduce(
            (sum, project) => sum + project.amount,
            0,
          );

          return {
            id: sale.id,
            userId: sale.userId,
            firstName: sale.user.firstName,
            lastName: sale.user.lastName,
            role: sale.user.role,
            phone: sale.user.phone,
            projectCount: projects.length,
            projects: projects,
            projectAmountSum: projectAmountSum,
          };
        });

        return { sales: formattedSales };
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
