import { BaseRepository } from '@/common/types/base-repository.type';

import { ProjectManager } from '@prisma/client';

import { CreateProjectManagerDto } from './dtos/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dtos/update-project-manager.dto';
import { ProjectManagerStatisticResponseDto } from './dtos/response/project-manager-statistic-response.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClassLoggerService } from '@/common/utils/loger.util';

@Injectable()
export class ProjectManagerRepository extends BaseRepository<
  ProjectManager,
  CreateProjectManagerDto,
  UpdateProjectManagerDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(ProjectManagerRepository.name);
  }

  public async create(dto: CreateProjectManagerDto): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
  public async find(): Promise<ProjectManager[]> {
    return await this.prismaService.projectManager
      .findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
  public async findById(id: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByUserId(userId: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .findUnique({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getProjectManagerStatistic(): Promise<ProjectManagerStatisticResponseDto> {
    const projectManagers = await this.prismaService.projectManager.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            phone: true,
          },
        },
        project: {
          select: {
            id: true,
          },
        },
      },
    }).catch((error) => {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    });

    const formattedProjectManagers = projectManagers.map((pm) => ({
      id: pm.id,
      userId: pm.user.id,
      firstName: pm.user.firstName,
      lastName: pm.user.lastName,
      role: pm.user.role,
      phone: pm.user.phone,
      projectCount: pm.project.length,
    }));

    return { projectManagers: formattedProjectManagers };
  }

  public async update(
    id: string,
    updates: UpdateProjectManagerDto,
  ): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .update({
        where: {
          id,
        },
        data: updates,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async delete(id: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
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
