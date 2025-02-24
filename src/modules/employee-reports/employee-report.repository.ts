import { BaseRepository } from '@/common/types/base-repository.type';

import { EmployeeReport } from '@prisma/client';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';
import { EmployeeReportResponse } from './dtos/response/employee-report-response.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { REPORT_STATUS } from '@/common/constants/report.status.constants';
import { NOTIFICATION_REQUEST } from '@/common/constants/notification-request.constants';
import { MODIFY_REPORT_REQUEST } from '@/common/constants/modify-report-request';
import { ClassLoggerService } from '@/common/utils/loger.util';
import { NotificationService } from '@/web-socket/notification/notification.service';

@Injectable()
export class EmployeeReportRepository extends BaseRepository<
  EmployeeReport | Object,
  CreateEmployeeReportDto,
  UpdateEmployeeReportDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    super();
    this.logger = new ClassLoggerService(EmployeeReportRepository.name);
  }

  public async create(dto: CreateEmployeeReportDto): Promise<EmployeeReport> {
    return await this.prismaService
      .$transaction(async (tx) => {
        const [hours, minutes] = dto.hoursWorked.split(':').map(Number);
        const hoursWorkedDecimal = hours + minutes / 60;

        const report = await tx.employeeReport.create({
          data: dto,
        });

        const project = await tx.project.findUnique({
          where: { id: report.projectId },
        });

        const incomeAmount = project.isOnUpwork
          ? hoursWorkedDecimal * project.rate * 0.9
          : hoursWorkedDecimal * project.rate;

        const income = await tx.projectIncome.create({
          data: {
            employeeReportId: report.id,
            projectName: project.name,
            clientName: project.clientName,
            hours: report.hoursWorked,
            amount: parseFloat(incomeAmount.toFixed(2)),
            date: report.date,
          },
        });

        return report;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<EmployeeReportResponse> {
    return await this.prismaService.employeeReport
      .findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmployeeIdAndDate(
    employeeId: string,
    date: string,
    projectId: string,
  ): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
      .findFirst({
        where: {
          employeeId,
          date,
          projectId,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmployeeId(
    employeeId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          employeeId,
        },
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByProjectManagerId(
    projectManagerId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          project: {
            projectManagerId,
          },
        },
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findBySalesId(
    salesId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          project: {
            salesId,
          },
        },
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByProjectId(
    projectId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          projectId,
        },
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmployeeIdAndProjectId(
    employeeId: string,
    projectId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          employeeId,
          projectId,
        },
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          employeeId: true,
          projectId: true,
          hoursWorked: true,
          startTime: true,
          endTime: true,
          date: true,
          text: true,
          editStatus: true,
          deleteStatus: true,
          updatedAt: true,
          createdAt: true,
          project: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async requestToModifyReport(
    dto: RequestModifyReportDto,
  ): Promise<EmployeeReport> {
    return this.prismaService
      .$transaction(async (tx) => {
        const updateData =
          dto.requestType === MODIFY_REPORT_REQUEST.EDIT
            ? { editStatus: REPORT_STATUS.PENDING }
            : { deleteStatus: REPORT_STATUS.PENDING };

        const report = await tx.employeeReport.update({
          where: { id: dto.reportId },
          data: updateData,
        });

        const [employee, project] = await Promise.all([
          tx.employee.findUnique({
            where: { id: report.employeeId },
            include: { user: true },
          }),
          tx.project.findUnique({
            where: { id: report.projectId },
            include: { projectManager: true },
          }),
        ]);

        const { user } = employee;
        const { projectManager } = project;

        const actionText =
          dto.requestType === MODIFY_REPORT_REQUEST.EDIT ? 'edit' : 'delete';

        const notification = await tx.notification.create({
          data: {
            fromUserId: user.id,
            toUserId: projectManager.userId,
            title:
              dto.requestType === MODIFY_REPORT_REQUEST.EDIT
                ? NOTIFICATION_REQUEST.EDIT
                : NOTIFICATION_REQUEST.DELETE,
            text: `${user.firstName} ${user.lastName}(${user.email}) has requested to ${actionText} the report.`,
            reportId: report.id,
          },
          include: {
            fromUser: true,
            toUser: true,
            report: true,
          },
        });

        this.notificationService.sendReportNotification(
          notification,
          projectManager.userId,
        );

        return report;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateEmployeeReportDto,
  ): Promise<EmployeeReport> {
    return await this.prismaService
      .$transaction(async (tx) => {
        const report = await tx.employeeReport.update({
          where: {
            id,
          },
          data: updates,
        });

        if (updates.hoursWorked) {
          const [hours, minutes] = updates.hoursWorked.split(':').map(Number);
          const hoursWorkedDecimal = hours + minutes / 60;
          const project = await tx.project.findUnique({
            where: { id: report.projectId },
          });

          await tx.projectIncome.update({
            where: {
              employeeReportId: report.id,
            },
            data: {
              hours: updates.hoursWorked,
              amount: project.isOnUpwork
                ? hoursWorkedDecimal * project.rate * 0.9
                : hoursWorkedDecimal * project.rate,
            },
          });
        }
        return report;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async delete(id: string): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
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
