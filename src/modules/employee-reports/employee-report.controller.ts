import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { EmployeeReportService } from './employee-report.service';

import { CreateEmployeeReportDto } from './dtos/create-employee-report.dto';
import { UpdateEmployeeReportDto } from './dtos/update-employee-report.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { EmployeeReport } from '@prisma/client';

import { MESSAGES } from '@/common/constants/messages.contants';

import { Request } from 'express';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RequestModifyReportDto } from './dtos/request-modify-report.dto';

@Controller('employee-reports')
@ApiTags('Employee Reports')
@UseGuards(AuthGuard)
export class EmployeeReportController {
  public constructor(
    private readonly employeeReportService: EmployeeReportService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateEmployeeReportDto,
  ): Promise<DataResponse<EmployeeReport>> {
    const report = await this.employeeReportService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: report,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<EmployeeReport[]>> {
    const reports = await this.employeeReportService.find();

    return {
      message: MESSAGES.FETCHED,
      data: reports,
      status: HttpStatus.OK,
    };
  }

  @Get('employee-project')
  public async findByEmployeeIdAndProjectId(
    @Query('employeeId') employeeId: string,
    @Query('projectId') projectId: string,
  ): Promise<DataResponse<EmployeeReport[]>> {
    const reports =
      await this.employeeReportService.findByEmployeeIdAndProjectId(
        employeeId,
        projectId,
      );

    return {
      message: MESSAGES.FETCHED,
      data: reports,
      status: HttpStatus.OK,
    };
  }

  @Get('employee/:employeeId')
  public async findByEmployeeId(
    @Param('employeeId') employeeId: string,
  ): Promise<DataResponse<EmployeeReport[]>> {
    const reports =
      await this.employeeReportService.findByEmployeeId(employeeId);

    return {
      message: MESSAGES.FETCHED,
      data: reports,
      status: HttpStatus.OK,
    };
  }

  @Get('project/:projectId')
  public async findByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<DataResponse<EmployeeReport[]>> {
    const reports = await this.employeeReportService.findByProjectId(projectId);

    return {
      message: MESSAGES.FETCHED,
      data: reports,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<EmployeeReport>> {
    const report = await this.employeeReportService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updates: UpdateEmployeeReportDto,
    @Req() request: Request,
  ): Promise<DataResponse<EmployeeReport>> {
    const { role } = request['user'];

    const report = await this.employeeReportService.update(id, updates, role);

    return {
      message: MESSAGES.UPDATED,
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Put('request-modify')
  public async requestToModifyReport(
    @Body() dto: RequestModifyReportDto,
  ): Promise<DataResponse<EmployeeReport>> {
    const report = await this.employeeReportService.requestToModifyReport(dto);

    return {
      message: MESSAGES.UPDATED,
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DataResponse<EmployeeReport>> {
    const { role } = request['user'];

    const report = await this.employeeReportService.delete(id, role);

    return {
      message: MESSAGES.DELETED,
      data: report,
      status: HttpStatus.OK,
    };
  }
}
