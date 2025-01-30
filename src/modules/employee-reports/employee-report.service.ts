import { BadRequestException, Injectable } from '@nestjs/common';

import { EmployeeReportRepository } from './employee-report.repository';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';

import { EmployeeReport } from '@prisma/client';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ROLE } from '@/common/constants/role.constants';
import { REPORT_STATUS } from '@/common/constants/report.status.constants';

import { differenceInMinutes } from 'date-fns';

@Injectable()
export class EmployeeReportService {
  public constructor(
    private readonly employeeReportRepository: EmployeeReportRepository,
  ) {}

  public async create(dto: CreateEmployeeReportDto): Promise<EmployeeReport> {
    const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    const endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    const minutesWorked = differenceInMinutes(endTime, startTime);
    const hoursWorked = minutesWorked / 60;

    return await this.employeeReportRepository.create({
      ...dto,
      hoursWorked,
    });
  }

  public async find(): Promise<EmployeeReport[]> {
    return await this.employeeReportRepository.find();
  }

  public async findById(id: string): Promise<EmployeeReport> {
    const report = await this.employeeReportRepository.findById(id);

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return report;
  }

  public async findByEmployeeId(employeeId: string): Promise<EmployeeReport[]> {
    return await this.employeeReportRepository.findByEmployeeId(employeeId);
  }

  public async findByProjectId(projectId: string): Promise<EmployeeReport[]> {
    return await this.employeeReportRepository.findByProjectId(projectId);
  }

  public async findByEmployeeIdAndProjectId(
    employeeId: string,
    projectId: string,
  ): Promise<EmployeeReport[]> {
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
          throw new BadRequestException(EXCEPTION.REPORT_NOT_EDITABLE);
        case REPORT_STATUS.ACCEPTED:
          if (updates.endTime) {
            const endTime = new Date(`1970-01-01T${updates.endTime}:00`);

            const minutesWorked = differenceInMinutes(
              endTime,
              report.startTime,
            );
            const hoursWorked = minutesWorked / 60;
            updates.hoursWorked = hoursWorked;
          }
          return await this.employeeReportRepository.update(id, {
            ...updates,
            editStatus: REPORT_STATUS.REJECTRED,
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
        report.deleteStatus === REPORT_STATUS.REJECTRED)
    ) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_EDITABLE);
    }

    if (!report) {
      throw new BadRequestException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return await this.employeeReportRepository.delete(id);
  }
}
