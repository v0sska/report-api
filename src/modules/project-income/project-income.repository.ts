import { BaseRepository } from '@/common/types/base-repository.type';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ProjectIncome } from '@prisma/client';

import { CreateProjectIncomeDto } from './dtos/create-project-income.dto';
import { UpdateProjectIncomeDto } from './dtos/update-project-income.dto';
import { StatisticResponseDto } from './dtos/response/statistic-response.dto';

import { PrismaService } from '@/database/prisma.service';

import { INCOME_STATUS } from '@/common/constants/income-status.constants';

import { ClassLoggerService } from '@/common/utils/loger.util';

@Injectable()
export class ProjectIncomeRepository extends BaseRepository<
  ProjectIncome,
  CreateProjectIncomeDto,
  UpdateProjectIncomeDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(ProjectIncomeRepository.name);
  }

  public async create(dto: CreateProjectIncomeDto): Promise<ProjectIncome> {
    return await this.prismaService.projectIncome
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<ProjectIncome[]> {
    return await this.prismaService.projectIncome.findMany().catch((error) => {
      this.logger.error(error.message);
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
        this.logger.error(error.message);
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
          (acc, income) => acc + income.amount.toNumber(),
          0,
        );
        const totalAmountFormatted = totalAmount.toFixed(2);

        const totalHours = incomes.reduce((acc, income) => {
          const [hours, minutes] = income.employeeReport.hoursWorked
            .split(':')
            .map(Number);
          const hoursInDecimal = hours + minutes / 60;
          return acc + hoursInDecimal;
        }, 0);
        const totalHoursFormatted = totalHours.toFixed(2);

        const totalIncomeAccepted = incomes
          .filter((income) => income.status === INCOME_STATUS.ACCEPTED)
          .reduce((acc, income) => acc + income.amount.toNumber(), 0);
        const totalIncomeAcceptedFormatted = totalIncomeAccepted.toFixed(2);

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

          const [hours, minutes] = income.employeeReport.hoursWorked
            .split(':')
            .map(Number);
          const hoursInDecimal = hours + minutes / 60;

          employeeMap.get(employeeId).incomes.push({
            id: income.id,
            reportId: income.employeeReportId,
            date: income.date,
            hours: hoursInDecimal,
            amount: income.amount.toNumber(),
            status: income.status,
          });
        });

        return {
          projectId: incomes[0]?.employeeReport.projectId,
          projectName: incomes[0]?.employeeReport.project.name,
          clientName: incomes[0]?.employeeReport.project.clientName,
          totalAmount: totalAmountFormatted,
          totalHours: totalHoursFormatted,
          projectHours: incomes[0]?.employeeReport.project.hoursInWeek,
          totalIncomeAccepted: totalIncomeAcceptedFormatted,
          employees: Array.from(employeeMap.values()),
        };
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getAllProjectsStatistics(): Promise<StatisticResponseDto[]> {
    return await this.prismaService
      .$transaction(async (tx) => {
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
              projectHours: income.employeeReport.project.hoursInWeek,
              totalIncomeAccepted: 0,
              employees: new Map(),
            });
          }

          const project = projectMap.get(projectId);

          const amount = income.amount ? income.amount.toNumber() : 0;
          const hours = income.hours;

          let hoursInDecimal = 0;
          if (typeof hours === 'string') {
            const [h, m] = hours.split(':').map(Number);
            hoursInDecimal = h + m / 60;
          } else {
            hoursInDecimal = hours;
          }

          project.totalAmount += amount;
          project.totalHours += hoursInDecimal;

          if (income.status === INCOME_STATUS.ACCEPTED) {
            project.totalIncomeAccepted += amount;
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
            amount: amount,
            status: income.status,
          });
        });

        const convertDecimalToTime = (decimalHours: number): string => {
          const hours = Math.floor(decimalHours);
          const minutes = Math.round((decimalHours - hours) * 60);
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        return Array.from(projectMap.values()).map((project) => ({
          ...project,
          totalAmount: project.totalAmount.toFixed(2),
          totalHours: convertDecimalToTime(project.totalHours),
          projectHours: project.projectHours,
          totalIncomeAccepted: project.totalIncomeAccepted.toFixed(2),
          employees: Array.from(project.employees.values()),
        }));
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
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
        this.logger.error(error.message);
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
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
}
