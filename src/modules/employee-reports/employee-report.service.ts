import { BadRequestException, Injectable } from '@nestjs/common';

import { EmployeeReportRepository } from './employee-report.repository';

import { EmployeeService } from '../employee/employee.service';
import { ProjectManagerService } from '../project-manager/project-manager.service';
import { SalesService } from '../sales/sales.service';
import { NotificationService } from '../notification/notification.service';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';
import { EmployeeReportResponse } from './dtos/response/employee-report-response.dto';

import { EmployeeReport } from '@prisma/client';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ROLE } from '@/common/constants/role.constants';
import { REPORT_STATUS } from '@/common/constants/report.status.constants';
import { NOTIFICATION_STATUS } from '@/common/constants/notification-status.constants';

import { differenceInMinutes, addDays } from 'date-fns';
import { ProjectIncomeService } from '../project-income/project-income.service';

@Injectable()
export class EmployeeReportService {
  public constructor(
    private readonly employeeReportRepository: EmployeeReportRepository,
    private readonly projectManagerService: ProjectManagerService,
    private readonly salesService: SalesService,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService,
    private readonly projectIncomeService: ProjectIncomeService,
  ) {}

  public async create(
    dto: CreateEmployeeReportDto,
    userId: string,
  ): Promise<EmployeeReport> {
    const employee = await this.employeeService.findByUserId(userId);

    const report = await this.employeeReportRepository.findByEmployeeIdAndDate(
      employee.id,
      dto.date.toString(),
      dto.projectId,
    );

    if (report) {
      throw new BadRequestException(EXCEPTION.REPORT_ALREADY_EXISTS);
    }

    const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    let endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    if (endTime < startTime) {
      endTime = addDays(endTime, 1);
    }

    const minutesWorked = differenceInMinutes(endTime, startTime);
    const hours = Math.floor(minutesWorked / 60);
    const minutes = minutesWorked % 60;

    const hoursWorked = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return await this.employeeReportRepository.create({
      ...dto,
      hoursWorked,
      employeeId: employee.id,
    });
  }

  public async find(
    userId: string,
    role: string,
  ): Promise<EmployeeReportResponse[]> {
    switch (role) {
      case ROLE.EMPLOYEE:
        return await this.findByEmployeeId(userId);
      case ROLE.PROJECT_MANAGER:
        const projectManager =
          await this.projectManagerService.findByUserId(userId);

        return await this.employeeReportRepository.findByProjectManagerId(
          projectManager.id,
        );
      case ROLE.SALES:
        const sales = await this.salesService.findByUserId(userId);

        return await this.employeeReportRepository.findBySalesId(sales.id);
      default:
        return await this.employeeReportRepository.find();
    }
  }

  public async findById(id: string): Promise<EmployeeReportResponse> {
    const report = await this.employeeReportRepository.findById(id);

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return report;
  }

  public async findByEmployeeId(
    userId: string,
  ): Promise<EmployeeReportResponse[]> {
    const employee = await this.employeeService.findByUserId(userId);

    return await this.employeeReportRepository.findByEmployeeId(employee.id);
  }

  public async findByProjectId(
    projectId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.employeeReportRepository.findByProjectId(projectId);
  }

  public async findByEmployeeIdAndProjectId(
    userId: string,
    projectId: string,
  ): Promise<EmployeeReportResponse[]> {
    const employee = await this.employeeService.findByUserId(userId);

    return await this.employeeReportRepository.findByEmployeeIdAndProjectId(
      employee.id,
      projectId,
    );
  }

  public async update(
    id: string,
    updates: UpdateEmployeeReportDto,
    role: string,
  ): Promise<EmployeeReport> {
    const report = await this.employeeReportRepository.findById(id);
    const notification = await this.notificationService.findPendingByReportId(
      report.id,
    );

    if (role === ROLE.PROJECT_MANAGER) {
      if (
        report.editStatus === REPORT_STATUS.ACCEPTED ||
        report.deleteStatus === REPORT_STATUS.ACCEPTED
      ) {
        await this.notificationService.update(notification.id, {
          status: NOTIFICATION_STATUS.ACCEPTED,
        });
      } else if (
        report.editStatus === REPORT_STATUS.REJECTED ||
        report.deleteStatus === REPORT_STATUS.REJECTED
      ) {
        await this.notificationService.update(notification.id, {
          status: NOTIFICATION_STATUS.REJECTED,
        });
      }
    }

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    if (role === ROLE.EMPLOYEE) {
      switch (report.editStatus) {
        case REPORT_STATUS.PENDING:
        case REPORT_STATUS.REJECTED:
        case REPORT_STATUS.DEFAULT:
          throw new BadRequestException(EXCEPTION.REPORT_NOT_EDITABLE);
        case REPORT_STATUS.ACCEPTED:
          if (updates.endTime) {
            const endTime = new Date(`1970-01-01T${updates.endTime}:00`);
            const startTime = new Date(`1970-01-01T${report.startTime}:00`);

            const minutesWorked = differenceInMinutes(endTime, startTime);
            const hours = Math.floor(minutesWorked / 60);
            const minutes = minutesWorked % 60;

            updates.hoursWorked = `${hours}:${minutes.toString().padStart(2, '0')}`;
          }
          return await this.employeeReportRepository.update(id, {
            ...updates,
            editStatus: REPORT_STATUS.DEFAULT,
            updatedAt: new Date(),
          });
      }
    }

    return await this.employeeReportRepository.update(id, updates);
  }

  public async requestToModifyReport(
    dto: RequestModifyReportDto,
  ): Promise<EmployeeReport> {
    const data = await this.employeeReportRepository.requestToModifyReport(dto);

    if (!data) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return data;
  }

  public async delete(id: string, role: string): Promise<EmployeeReport> {
    const report = await this.employeeReportRepository.findById(id);

    if (
      role === ROLE.EMPLOYEE &&
      (report.deleteStatus === REPORT_STATUS.PENDING ||
        report.deleteStatus === REPORT_STATUS.REJECTED ||
        report.deleteStatus === REPORT_STATUS.DEFAULT)
    ) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_EDITABLE);
    }

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return await this.employeeReportRepository.delete(id);
  }
}
