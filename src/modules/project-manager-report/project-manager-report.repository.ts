import { BaseRepository } from '@/common/types/base-repository.type';

import { ProjectManagerReport } from '@prisma/client';

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
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(
    dto: CreateProjectManagerReportDto,
  ): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<ProjectManagerReport[]> {
    return await this.prismaService.projectManagerReport
      .findMany()
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findById(id: string): Promise<ProjectManagerReport> {
    return await this.prismaService.projectManagerReport
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
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
      })
      .catch((error) => {
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
        throw new InternalServerErrorException(error.message);
      });
  }
}
