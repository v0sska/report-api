import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectManagerReportService } from './project-manager-report.service';

import { ProjectManagerReport } from '@prisma/client';

import { CreateProjectManagerReportDto } from './dtos/create-project-manager-report.dto';
import { UpdateProjectManagerReportDto } from './dtos/update-project-manager-report.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/common/guards/auth.guard';

import { Request } from 'express';

import { MESSAGES } from '@/common/constants/messages.contants';

@ApiTags('project-manager-reports')
@Controller('project-manager-reports')
@UseGuards(AuthGuard)
export class ProjectManagerReportController {
  public constructor(
    private readonly projectManagerReportService: ProjectManagerReportService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateProjectManagerReportDto,
    @Req() request: Request,
  ): Promise<DataResponse<ProjectManagerReport>> {
    const { id } = request['user'];

    const projectmanagerreport = await this.projectManagerReportService.create(
      id,
      dto,
    );

    return {
      message: MESSAGES.CREATED,
      data: projectmanagerreport,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(
    @Req() request: Request,
  ): Promise<DataResponse<ProjectManagerReport[]>> {
    const { id, role } = request['user'];

    const projectmanagerreport = await this.projectManagerReportService.find(
      id,
      role,
    );

    return {
      message: MESSAGES.FETCHED,
      data: projectmanagerreport,
      status: HttpStatus.OK,
    };
  }

  @Get('project-manager/:id')
  public async findByProjectManagerId(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectManagerReport[]>> {
    const projectmanagerreport =
      await this.projectManagerReportService.findProjectManagerReportByProjectId(
        id,
      );

    return {
      message: MESSAGES.FETCHED,
      data: projectmanagerreport,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectManagerReport>> {
    const projectmanagerreport =
      await this.projectManagerReportService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: projectmanagerreport,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectManagerReportDto,
  ): Promise<DataResponse<ProjectManagerReport>> {
    const projectmanagerreport = await this.projectManagerReportService.update(
      id,
      dto,
    );

    return {
      message: MESSAGES.UPDATED,
      data: projectmanagerreport,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectManagerReport>> {
    const projectmanagerreport =
      await this.projectManagerReportService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: projectmanagerreport,
      status: HttpStatus.OK,
    };
  }
}
