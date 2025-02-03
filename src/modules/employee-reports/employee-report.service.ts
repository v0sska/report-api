import { BadRequestException, Injectable } from '@nestjs/common';

import { EmployeeReportRepository } from './employee-report.repository';
import { EmployeeService } from '../employee/employee.service';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';
import { EmployeeReportResponse } from './dtos/response/employee-report-response.dto';

import { EmployeeReport } from '@prisma/client';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ROLE } from '@/common/constants/role.constants';
import { REPORT_STATUS } from '@/common/constants/report.status.constants';

import { differenceInMinutes } from 'date-fns';

@Injectable()
export class EmployeeReportService {
  public constructor(
    private readonly employeeReportRepository: EmployeeReportRepository,
    private readonly employeeService: EmployeeService,
  ) {}

  public async create(
    dto: CreateEmployeeReportDto,
    userId: string,
  ): Promise<EmployeeReport> {
    const employee = await this.employeeService.findByUserId(userId);

    const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    const endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    const minutesWorked = differenceInMinutes(endTime, startTime);
    const hoursWorked = minutesWorked / 60;

    return await this.employeeReportRepository.create({
      ...dto,
      hoursWorked,
      employeeId: employee.id,
    });
  }

  public async find(): Promise<EmployeeReportResponse[]> {
    return await this.employeeReportRepository.find();
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
    employeeId: string,
    projectId: string,
  ): Promise<EmployeeReportResponse[]> {
    return await this.employeeReportRepository.findByEmployeeIdAndProjectId(
      employeeId,
      projectId,
    );
  }

  public async update(
    id: string,
    updates: UpdateEmployeeReportDto,
    role: string,
  ): Promise<EmployeeReport> {
    const report = await this.employeeReportRepository.findById(id);

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    if (role === ROLE.EMPLOYEE) {
      switch (report.editStatus) {
        case REPORT_STATUS.PENDING:
        case REPORT_STATUS.REJECTRED:
        case REPORT_STATUS.DEFAULT:
          throw new BadRequestException(EXCEPTION.REPORT_NOT_EDITABLE);
        case REPORT_STATUS.ACCEPTED:
          if (updates.endTime) {
            const endTime = new Date(`1970-01-01T${updates.endTime}:00`);
            const startTime = new Date(`1970-01-01T${report.startTime}:00`);
            const minutesWorked = differenceInMinutes(endTime, startTime);
            const hoursWorked = minutesWorked / 60;
            updates.hoursWorked = hoursWorked;
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
        report.deleteStatus === REPORT_STATUS.REJECTRED ||
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
