import { ProjectManagerReportRepository } from './project-manager-report.repository';
import { ProjectManagerService } from '../project-manager/project-manager.service';

import { ProjectManagerReport } from '@prisma/client';

import { CreateProjectManagerReportDto } from './dtos/create-project-manager-report.dto';
import { UpdateProjectManagerReportDto } from './dtos/update-project-manager-report.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ROLE } from '@/common/constants/role.constants';

@Injectable()
export class ProjectManagerReportService {
  public constructor(
    private readonly projectManagerService: ProjectManagerService,
    private readonly projectManagerReportRepositroy: ProjectManagerReportRepository,
  ) {}

  public async create(
    userId: string,
    dto: CreateProjectManagerReportDto,
  ): Promise<ProjectManagerReport> {
    const projectManager =
      await this.projectManagerService.findByUserId(userId);
    return await this.projectManagerReportRepositroy.create({
      ...dto,
      projectManagerId: projectManager.id,
    });
  }

  public async find(
    userId: string,
    role: string,
  ): Promise<ProjectManagerReport[]> {
    const projectManager =
      await this.projectManagerService.findByUserId(userId);
    switch (role) {
      case ROLE.ADMIN:
      case ROLE.PMDO:
      case ROLE.SUPER_ADMIN:
        return await this.projectManagerReportRepositroy.find();
      case ROLE.PROJECT_MANAGER:
        return await this.projectManagerReportRepositroy.findByProjectManagerId(
          projectManager.id,
        );
      default:
        throw new BadRequestException(EXCEPTION.PERMISSION_DENIED);
    }
  }

  public async findProjectManagerReportByProjectId(
    userId: string,
  ): Promise<ProjectManagerReport[]> {
    const projectManager =
      await this.projectManagerService.findByUserId(userId);
    return await this.projectManagerReportRepositroy.findByProjectManagerId(
      projectManager.id,
    );
  }

  public async findById(id: string): Promise<ProjectManagerReport> {
    const projectmanagerreport =
      await this.projectManagerReportRepositroy.findById(id);

    if (!projectmanagerreport) {
      throw new NotFoundException(EXCEPTION.PROJECT_MANAGER_REPORT_NOT_FOUND);
    }

    return projectmanagerreport;
  }

  public async update(
    id: string,
    updates: UpdateProjectManagerReportDto,
  ): Promise<ProjectManagerReport> {
    const projectmanagerreport =
      await this.projectManagerReportRepositroy.update(id, updates);

    if (!projectmanagerreport) {
      throw new NotFoundException(EXCEPTION.PROJECT_MANAGER_REPORT_NOT_FOUND);
    }

    return projectmanagerreport;
  }

  public async delete(id: string): Promise<ProjectManagerReport> {
    const projectmanagerreport =
      await this.projectManagerReportRepositroy.delete(id);

    if (!projectmanagerreport) {
      throw new NotFoundException(EXCEPTION.PROJECT_MANAGER_REPORT_NOT_FOUND);
    }

    return projectmanagerreport;
  }
}
