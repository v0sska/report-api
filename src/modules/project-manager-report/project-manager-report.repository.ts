import { BaseRepository } from '@/common/types/base-repository.type';

import { ProjectManagerReport } from '@prisma/client';

import { ClassLoggerService } from '@/common/utils/loger.util';

import { CreateProjectManagerReportDto } from './dtos/create-project-manager-report.dto';
import { UpdateProjectManagerReportDto } from './dtos/update-project-manager-report.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProjectManagerReportRepository extends BaseRepository<
  ProjectManagerReport,
  CreateProjectManagerReportDto,
  UpdateProjectManagerReportDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(ProjectManagerReportRepository.name);
  }

  public async create(
    dto: CreateProjectManagerReportDto,
  ): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<ProjectManagerReport[]> {
    return await this.prismaService.projectManagerReport
      .findMany({
        include: {
          projectManager: {
            include: {
              user: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
      .findUnique({
        where: {
          id,
        },
        include: {
          projectManager: {
            include: {
              user: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByProjectManagerId(
    projectManagerId: string,
  ): Promise<ProjectManagerReport[]> {
    return await this.prismaService.projectManagerReport
      .findMany({
        where: {
          projectManagerId,
        },
        include: {
          projectManager: {
            include: {
              user: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateProjectManagerReportDto,
  ): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
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

  public async delete(id: string): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
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
