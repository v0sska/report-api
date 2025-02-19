import { BadRequestException, Injectable } from '@nestjs/common';

import { ProjectIncomeRepository } from './project-income.repository';

import { ProjectIncome } from '@prisma/client';

import { CreateProjectIncomeDto } from './dtos/create-project-income.dto';
import { UpdateProjectIncomeDto } from './dtos/update-project-income.dto';
import { StatisticResponseDto } from './dtos/response/statistic-response.dto';

import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class ProjectIncomeService {
  public constructor(
    private readonly projectIncomeRepository: ProjectIncomeRepository,
  ) {}

  public async create(dto: CreateProjectIncomeDto): Promise<ProjectIncome> {
    return await this.projectIncomeRepository.create(dto);
  }

  public async find(): Promise<ProjectIncome[]> {
    return await this.projectIncomeRepository.find();
  }

  public async findById(id: string): Promise<ProjectIncome> {
    const income = await this.projectIncomeRepository.findById(id);

    if (!income) {
      throw new BadRequestException(EXCEPTION.INCOME_NOT_FOUND);
    }

    return income;
  }

  public async getStatisticsByProjectId(
    projectId: string,
  ): Promise<StatisticResponseDto> {
    const statistics =
      await this.projectIncomeRepository.getStatisticsByProjectId(projectId);

    if (!statistics) {
      throw new BadRequestException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return statistics;
  }

  public async getAllProjectsStatistics(): Promise<{
    statistics: StatisticResponseDto[];
    totalAllProjectsHours: string;
    totalAllProjectsIncome: string;
    totalAllProjectsAcceptedIncome: string;
  }> {
    return await this.projectIncomeRepository.getAllProjectsStatistics();
  }

  public async update(
    id: string,
    dto: UpdateProjectIncomeDto,
  ): Promise<ProjectIncome> {
    const income = await this.projectIncomeRepository.update(id, dto);

    if (!income) {
      throw new BadRequestException(EXCEPTION.INCOME_NOT_FOUND);
    }

    return income;
  }

  public async delete(id: string): Promise<ProjectIncome> {
    const income = await this.projectIncomeRepository.delete(id);

    if (!income) {
      throw new BadRequestException(EXCEPTION.INCOME_NOT_FOUND);
    }

    return income;
  }
}
