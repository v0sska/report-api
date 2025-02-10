import { BaseRepository } from '@/common/types/base-repository.type';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ProjectIncome } from '@prisma/client';

import { CreateProjectIncomeDto } from './dtos/create-project-income.dto';
import { UpdateProjectIncomeDto } from './dtos/update-project-income.dto';
import { StatisticResponseDto } from './dtos/response/statistic-response.dto';

import { PrismaService } from '@/database/prisma.service';

import { INCOME_STATUS } from '@/common/constants/income-status.constants';

@Injectable()
export class ProjectIncomeRepository extends BaseRepository<
  ProjectIncome,
  CreateProjectIncomeDto,
  UpdateProjectIncomeDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateProjectIncomeDto): Promise<ProjectIncome> {
    return await this.prismaService.projectIncome
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<ProjectIncome[]> {
    return await this.prismaService.projectIncome.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<ProjectIncome> {
    return await this.prismaService.projectIncome
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getStatisticsByProjectId(
    projectId: string,
  ): Promise<StatisticResponseDto> {
    return await this.prismaService
      .$transaction(async (tx) => {
        const incomes = await tx.projectIncome.findMany({
          where: {
            employeeReport: {
              projectId,
            },
          },
          include: {
            employeeReport: {
              include: {
                project: true,
                employee: {
                  include: {
                    user: true,
                    employeeOnProject: {
                      where: {
                        projectId: projectId,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const totalAmount = incomes.reduce(
          (acc, income) => acc + income.amount,
          0,
        );
        const totalHours = incomes.reduce(
          (acc, income) => acc + income.hours,
          0,
        );
        const totalIncomeAccepted = incomes
          .filter((income) => income.status === INCOME_STATUS.ACCEPTED)
          .reduce((acc, income) => acc + income.amount, 0);

        const employeeMap = new Map();

        incomes.forEach((income) => {
          const employeeId = income.employeeReport.employee.id;
          const employeeOnProject =
            income.employeeReport.employee.employeeOnProject.find(
              (eop) =>
                eop.projectId === projectId && eop.employeeId === employeeId,
            );

          if (!employeeMap.has(employeeId)) {
            employeeMap.set(employeeId, {
              id: employeeId,
              userId: income.employeeReport.employee.userId,
              firstName: income.employeeReport.employee.user.firstName,
              lastName: income.employeeReport.employee.user.lastName,
              rate: income.employeeReport.project.rate,
              maxHours: employeeOnProject ? employeeOnProject.hoursWorked : 0,
              incomes: [],
            });
          }

          employeeMap.get(employeeId).incomes.push({
            id: income.id,
            reportId: income.employeeReportId,
            date: income.date,
            hours: income.hours,
            amount: income.amount,
            status: income.status,
          });
        });

        return {
          projectId: incomes[0]?.employeeReport.projectId,
          projectName: incomes[0]?.employeeReport.project.name,
          clientName: incomes[0]?.employeeReport.project.clientName,
          totalAmount,
          totalHours,
          totalIncomeAccepted,
          employees: Array.from(employeeMap.values()),
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getAllProjectsStatistics(): Promise<StatisticResponseDto[]> {
    return await this.prismaService.$transaction(async (tx) => {
      const incomes = await tx.projectIncome.findMany({
        include: {
          employeeReport: {
            include: {
              project: true,
              employee: {
                include: {
                  user: true,
                  employeeOnProject: true,
                },
              },
            },
          },
        },
      });

      const projectMap = new Map();

      incomes.forEach((income) => {
        const projectId = income.employeeReport.projectId;
        const employeeId = income.employeeReport.employee.id;

        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, {
            projectId,
            projectName: income.employeeReport.project.name,
            clientName: income.employeeReport.project.clientName,
            totalAmount: 0,
            totalHours: 0,
            totalIncomeAccepted: 0,
            employees: new Map(),
          });
        }

        const project = projectMap.get(projectId);

        project.totalAmount += income.amount;
        project.totalHours += income.hours;
        if (income.status === INCOME_STATUS.ACCEPTED) {
          project.totalIncomeAccepted += income.amount;
        }

        if (!project.employees.has(employeeId)) {
          const employeeOnProject =
            income.employeeReport.employee.employeeOnProject.find(
              (eop) =>
                eop.projectId === projectId && eop.employeeId === employeeId,
            );

          project.employees.set(employeeId, {
            id: employeeId,
            userId: income.employeeReport.employee.userId,
            firstName: income.employeeReport.employee.user.firstName,
            lastName: income.employeeReport.employee.user.lastName,
            rate: income.employeeReport.project.rate,
            maxHours: employeeOnProject ? employeeOnProject.hoursWorked : 0,
            incomes: [],
          });
        }

        project.employees.get(employeeId).incomes.push({
          id: income.id,
          reportId: income.employeeReportId,
          date: income.date,
          hours: income.hours,
          amount: income.amount,
          status: income.status,
        });
      });

      return Array.from(projectMap.values()).map((project) => ({
        ...project,
        employees: Array.from(project.employees.values()),
      }));
    });
  }

  public async update(
    id: string,
    updates: UpdateProjectIncomeDto,
  ): Promise<ProjectIncome> {
    return await this.prismaService.projectIncome
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

  public async delete(id: string): Promise<ProjectIncome> {
    return await this.prismaService.projectIncome
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
