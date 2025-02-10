import { BadRequestException, Injectable } from '@nestjs/common';

import { ProjectManagerRepository } from './project-manager.repository';

import { CreateProjectManagerDto } from './dtos/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dtos/update-project-manager.dto';

import { ProjectManager } from '@prisma/client';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ProjectManagerStatisticResponseDto } from './dtos/response/project-manager-statistic-response.dto';

@Injectable()
export class ProjectManagerService {
  public constructor(
    private readonly projectManagerRepository: ProjectManagerRepository,
  ) {}

  public async create(dto: CreateProjectManagerDto): Promise<ProjectManager> {
    return await this.projectManagerRepository.create(dto);
  }

  public async find(): Promise<ProjectManager[]> {
    return await this.projectManagerRepository.find();
  }

  public async findById(id: string): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.findById(id);

    if (!projectManager) {
      throw new BadRequestException(EXCEPTION.PROJECT_MANAGER_NOT_FOUND);
    }

    return projectManager;
  }

  public async findByUserId(userId: string): Promise<ProjectManager> {
    const projectManager =
      await this.projectManagerRepository.findByUserId(userId);

    if (!projectManager) {
      throw new BadRequestException(EXCEPTION.PROJECT_MANAGER_NOT_FOUND);
    }

    return projectManager;
  }

  public async getProjectManagerStatistic(): Promise<ProjectManagerStatisticResponseDto> {
    return await this.projectManagerRepository.getProjectManagerStatistic();
  }

  public async update(
    id: string,
    updates: UpdateProjectManagerDto,
  ): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.update(
      id,
      updates,
    );

    if (!projectManager) {
      throw new BadRequestException(EXCEPTION.PROJECT_MANAGER_NOT_FOUND);
    }

    return projectManager;
  }

  public async delete(id: string): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.delete(id);

    if (!projectManager) {
      throw new BadRequestException(EXCEPTION.PROJECT_MANAGER_NOT_FOUND);
    }

    return projectManager;
  }
}
