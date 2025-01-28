import { BaseRepository } from '@/common/types/base-repository.type';

import { Employee, Project, ProjectManager } from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AssignMembersDto } from './dtos/assign-members.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PROJECT_ENGAGMENT } from '@/common/constants/project-engagment.contants';

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

  public async assignMembersToProject(dto: AssignMembersDto): Promise<Project> {
    return this.prismaService.$transaction(async (tx) => {
      const employeeOnProjects = dto.employees.map((employee) => ({
        employeeId: employee.id,
        projectId: dto.projectId,
      }));

      await Promise.all(
        dto.employees.map((e) =>
          tx.employee.update({
            where: { id: e.id },
            data: {
              hoursPerWeek: { increment: e.hoursInWeek },
              projectEngagement:
                e.hoursInWeek >= 40
                  ? PROJECT_ENGAGMENT.FULL_TIME
                  : PROJECT_ENGAGMENT.PART_TIME,
            },
          }),
        ),
      );

      await tx.employeeOnProject.createMany({
        data: employeeOnProjects,
      });

      return tx.project.update({
        where: { id: dto.projectId },
        data: { projectManagerId: dto.projectManagerId },
      });
    });
  }

  public async find(userId?: string): Promise<Object[]> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: {
            id: userId,
          },
        });

        switch (user.role) {
          case 'PMDepartmentOfficer':
            return await tx.project.findMany({
              select: {
                id: true,
                name: true,
                clientName: true,
                rate: false,
                hoursInWeek: true,
                teamInfo: true,
                status: true,
                salesId: true,
              },
            });
          case 'ProjectManager':
            const projectManager = await tx.projectManager.findUnique({
              where: {
                userId,
              },
            });

            return await tx.project.findMany({
              where: {
                projectManagerId: projectManager.id,
              },
              select: {
                id: true,
                name: true,
                clientName: true,
                rate: false,
                hoursInWeek: true,
                teamInfo: true,
                status: true,
                salesId: true,
              },
            });
          case 'Employee':
            const employee = await tx.employee.findUnique({
              where: {
                userId,
              },
            });

            const employeeOnProjects = await tx.employeeOnProject.findMany({
              where: {
                employeeId: employee.id,
              },
            });

            const employeeProjectIds = employeeOnProjects.map(
              (eop) => eop.projectId,
            );

            return await tx.project.findMany({
              where: {
                id: {
                  in: employeeProjectIds,
                },
              },
              select: {
                id: true,
                name: true,
                clientName: true,
                rate: false,
                hoursInWeek: true,
                teamInfo: true,
                status: true,
                salesId: true,
              },
            });

          case 'Sales':
            const sales = await tx.sales.findUnique({
              where: {
                userId,
              },
            });

            return await tx.project.findMany({
              where: {
                salesId: sales.id,
              },
              select: {
                id: true,
                name: true,
                clientName: true,
                rate: true,
                hoursInWeek: true,
                teamInfo: true,
                status: true,
                salesId: true,
              },
            });
          default:
            return await tx.project.findMany();
        }
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
    return tx;
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
    return await this.prismaService.project
      .findMany({
        where: {
          projectManagerId: projectManagerId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
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
        include: {
          user: true,
        },
      });
    });

    return tx;
  }

  public async findProjectManagerByProjectId(
    projectId: string,
  ): Promise<ProjectManager | null> {
    return await this.prismaService.projectManager
      .findFirst({
        where: {
          project: {
            some: {
              id: projectId,
            },
          },
        },
        include: {
          user: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
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
