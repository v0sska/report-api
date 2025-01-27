import { BaseRepository } from '@/common/types/base-repository.type';

import {
  Employee,
  EmployeeOnProject,
  Project,
  ProjectManager,
  ProjectManagerOnProject,
} from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AssignEmployeeDto } from './dtos/assign-employee.dto';
import { AssignProjectManagerDto } from './dtos/assign-project-manager.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProjectRepository extends BaseRepository<
  Project | Object,
  CreateProjectDto,
  UpdateProjectDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateProjectDto): Promise<Project> {
    return await this.prismaService.project
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async assignEmployeeToProject(
    dto: AssignEmployeeDto,
  ): Promise<EmployeeOnProject> {
    return await this.prismaService.employeeOnProject
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async assignProjectManagerToProject(
    dto: AssignProjectManagerDto,
  ): Promise<ProjectManagerOnProject> {
    return await this.prismaService.projectManagerOnProject
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(isPMDO: boolean = false): Promise<Project[]> {
    return await this.prismaService.project.findMany({
      select: {
        id: true,
        name: true,
        rate: isPMDO ? false : true,
        clientName: true,
        teamInfo: true,
        hoursInWeek: true,
        status: true,
        salesId: true,
      }
    }).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<Project> {
    return await this.prismaService.project
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findProjectByEmployeeId(employeeId: string): Promise<Project[]> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const employeeOnProjects = await tx.employeeOnProject.findMany({
          where: {
            employeeId,
          },
        });

        const projectIds = employeeOnProjects.map((eop) => eop.projectId);

        return await tx.project.findMany({
          where: {
            id: {
              in: projectIds,
            },
          },
        });
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });

    return tx;
  }

  public async findProjectByProjectManagerId(
    projectManagerId: string,
  ): Promise<Project[]> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const projectManagerOnProjects =
          await tx.projectManagerOnProject.findMany({
            where: {
              projectManagerId,
            },
          });

        const projectIds = projectManagerOnProjects.map(
          (pmop) => pmop.projectId,
        );

        return await tx.project.findMany({
          where: {
            id: {
              in: projectIds,
            },
          },
        });
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });

    return tx;
  }

  public async findEmployeesByProjectId(
    projectId: string,
  ): Promise<Employee[]> {
    const tx = await this.prismaService.$transaction(async (tx) => {
      const employeeOnProjects = await tx.employeeOnProject.findMany({
        where: {
          projectId,
        },
      });

      const employeeIds = employeeOnProjects.map((eop) => eop.employeeId);

      return await tx.employee.findMany({
        where: {
          id: {
            in: employeeIds,
          },
        },
      });
    });

    return tx;
  }

  public async findProjectManagerByProjectId(
    projectId: string,
  ): Promise<ProjectManager> {
    const tx = await this.prismaService.$transaction(async (tx) => {
      const projectManagerOnProject =
        await tx.projectManagerOnProject.findFirst({
          where: {
            projectId,
          },
        });

      return await tx.projectManager.findUnique({
        where: {
          id: projectManagerOnProject.projectManagerId,
        },
      });
    });

    return tx;
  }

  public async update(id: string, updates: UpdateProjectDto): Promise<Project> {
    return await this.prismaService.project
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

  public async delete(id: string): Promise<Project> {
    return await this.prismaService.project
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
