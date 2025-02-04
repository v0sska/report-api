import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ProjectIncomeService } from './project-income.service';

import { CreateProjectIncomeDto } from './dtos/create-project-income.dto';
import { StatisticResponseDto } from './dtos/response/statistic-response.dto';
import { UpdateProjectIncomeDto } from './dtos/update-project-income.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ProjectIncome } from '@prisma/client';

import { MESSAGES } from '@/common/constants/messages.contants';

@Controller('project-income')
@ApiTags('Project Income')
export class ProjectIncomeController {
  public constructor(
    private readonly projectIncomeService: ProjectIncomeService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateProjectIncomeDto,
  ): Promise<DataResponse<ProjectIncome>> {
    const income = await this.projectIncomeService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: income,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<ProjectIncome[]>> {
    const incomes = await this.projectIncomeService.find();

    return {
      message: MESSAGES.FETCHED,
      data: incomes,
      status: HttpStatus.OK,
    };
  }

  @Get('statistics')
  public async getAllProjectsStatistics(): Promise<
    DataResponse<StatisticResponseDto[]>
  > {
    const statistics =
      await this.projectIncomeService.getAllProjectsStatistics();

    return {
      message: MESSAGES.FETCHED,
      data: statistics,
      status: HttpStatus.OK,
    };
  }

  @Get('statistic/:projectId')
  public async getStatisticsByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<DataResponse<StatisticResponseDto>> {
    const statistics =
      await this.projectIncomeService.getStatisticsByProjectId(projectId);

    return {
      message: MESSAGES.FETCHED,
      data: statistics,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectIncome>> {
    const income = await this.projectIncomeService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: income,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectIncomeDto,
  ): Promise<DataResponse<ProjectIncome>> {
    const income = await this.projectIncomeService.update(id, dto);

    return {
      message: MESSAGES.UPDATED,
      data: income,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectIncome>> {
    const income = await this.projectIncomeService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: income,
      status: HttpStatus.OK,
    };
  }
}
