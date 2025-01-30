import { BaseRepository } from '@/common/types/base-repository.type';

import { EmployeeReport } from '@prisma/client';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { REPORT_STATUS } from '@/common/constants/report.status.constants';
import { NOTIFICATION_REQUEST } from '@/common/constants/notification-request.constants';
import {
  MODIFY_REPORT_REQUEST,
  ModifyReportRequestValues,
} from '@/common/constants/modify-report-request';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';

@Injectable()
export class EmployeeReportRepository extends BaseRepository<
  EmployeeReport,
  CreateEmployeeReportDto,
  UpdateEmployeeReportDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateEmployeeReportDto): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<EmployeeReport[]> {
    return await this.prismaService.employeeReport.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmployeeId(employeeId: string): Promise<EmployeeReport[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          employeeId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByProjectId(projectId: string): Promise<EmployeeReport[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          projectId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByEmployeeIdAndProjectId(
    employeeId: string,
    projectId: string,
  ): Promise<EmployeeReport[]> {
    return await this.prismaService.employeeReport
      .findMany({
        where: {
          employeeId,
          projectId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async requestToModifyReport(
    dto: RequestModifyReportDto,
  ): Promise<EmployeeReport> {
    return this.prismaService
      .$transaction(async (tx) => {
        const report = await tx.employeeReport.update({
          where: { id: dto.reportId },
          data: { editStatus: REPORT_STATUS.PENDING },
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

        await tx.notification.create({
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
        });

        return report;
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateEmployeeReportDto,
  ): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
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

  public async delete(id: string): Promise<EmployeeReport> {
    return await this.prismaService.employeeReport
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
