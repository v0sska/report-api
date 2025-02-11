import { BaseRepository } from '@/common/types/base-repository.type';

import { Employee, Project, ProjectManager } from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AssignMembersDto } from './dtos/assign-members.dto';
import { TeamResponseDto } from './dtos/response/team.response.dto';
import { UpdateEmployeeHoursDto } from './dtos/update-employee-hours.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PROJECT_ENGAGMENT } from '@/common/constants/project-engagment.contants';
import { ROLE } from '@/common/constants/role.constants';
import { PROJECT_STATUS } from '@/common/constants/project-status.constants';

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
        hoursWorked: employee.hoursInWeek,
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

  public async removeMembersFromProject(
    projectId: string,
    employeeId: string,
  ): Promise<Project> {
    return this.prismaService
      .$transaction(async (tx) => {
        const employeeOnProject = await tx.employeeOnProject.delete({
          where: {
            employeeId_projectId: {
              employeeId: employeeId,
              projectId: projectId,
            },
          },
        });

        const employee = await tx.employee.update({
          where: { id: employeeId },
          data: {
            hoursPerWeek: { decrement: employeeOnProject.hoursWorked },
          },
        });

        await tx.employee.update({
          where: { id: employeeId },
          data: {
            projectEngagement:
              employee.hoursPerWeek > 0
                ? PROJECT_ENGAGMENT.PART_TIME
                : PROJECT_ENGAGMENT.AVAILABLE,
          },
        });

        return tx.project.findUnique({
          where: {
            id: projectId,
          },
        });
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
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
          case ROLE.PMDO:
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
          case ROLE.PROJECT_MANAGER:
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
          case ROLE.EMPLOYEE:
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

          case ROLE.SALES:
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
        include: {
          employeeReport: {
            orderBy: {
              date: 'desc',
            },
            include: {
              employee: {
                include: {
                  user: true,
                },
              },
            },
            take: 3,
          },
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findMembersByProjectId(
    projectId: string,
  ): Promise<TeamResponseDto> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const project = await tx.project.findUnique({
          where: { id: projectId },
        });

        const employeeOnProjects = await tx.employeeOnProject.findMany({
          where: { projectId: project.id },
        });

        const employeeIds = employeeOnProjects.map((eop) => eop.employeeId);

        const employees = await tx.employee.findMany({
          where: { id: { in: employeeIds } },
          include: { user: true },
        });

        const employeesWithHours = employees.map((employee) => {
          const employeeProject = employeeOnProjects.find(
            (eop) => eop.employeeId === employee.id,
          );
          return {
            ...employee,
            hoursWorked: employeeProject ? employeeProject.hoursWorked : 0,
          };
        });

        const projectManager = await tx.projectManager.findFirst({
          where: { project: { some: { id: project.id } } },
          include: { user: true },
        });

        const sales = await tx.sales.findFirst({
          where: { project: { some: { id: project.id } } },
          include: { user: true },
        });

        return {
          name: project.name,
          sales,
          projectManager,
          employees: employeesWithHours,
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });

    return tx;
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
    return await this.prismaService.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: {
          id,
        },
        data: updates,
      });

      switch (updates.status) {
        case PROJECT_STATUS.COMPLETED:
        case PROJECT_STATUS.CANCELLED:
          const employeeOnProject = await tx.employeeOnProject.findMany({
            where: { projectId: project.id },
          });

          await Promise.all(
            employeeOnProject.map((eop) =>
              tx.employee.update({
                where: { id: eop.employeeId },
                data: {
                  hoursPerWeek: { decrement: eop.hoursWorked },
                },
              }),
            ),
          );

          const updatedEmployees = await tx.employee.findMany({
            where: {
              id: { in: employeeOnProject.map((eop) => eop.employeeId) },
            },
            select: { id: true, hoursPerWeek: true },
          });

          await Promise.all(
            updatedEmployees.map((emp) =>
              tx.employee.update({
                where: { id: emp.id },
                data: {
                  projectEngagement:
                    emp.hoursPerWeek > 0
                      ? PROJECT_ENGAGMENT.PART_TIME
                      : PROJECT_ENGAGMENT.AVAILABLE,
                },
              }),
            ),
          );
          break;

        default:
          break;
      }

      return project;
    });
  }

  public async updateEmployeeHours(
    dto: UpdateEmployeeHoursDto,
  ): Promise<Project> {
    return this.prismaService.$transaction(async (tx) => {
      await Promise.all(
        dto.employees.map(async (e) => {
          const employeeOnProject = await tx.employeeOnProject.findUnique({
            where: {
              employeeId_projectId: {
                employeeId: e.id,
                projectId: dto.projectId,
              },
            },
          });

          if (employeeOnProject) {
            await tx.employeeOnProject.update({
              where: {
                employeeId_projectId: {
                  employeeId: e.id,
                  projectId: dto.projectId,
                },
              },
              data: {
                hoursWorked: e.hoursInWeek,
              },
            });

            await tx.employee.update({
              where: { id: e.id },
              data: {
                hoursPerWeek: {
                  increment: e.hoursInWeek - employeeOnProject.hoursWorked,
                },
                projectEngagement:
                  e.hoursInWeek >= 40
                    ? PROJECT_ENGAGMENT.FULL_TIME
                    : e.hoursInWeek > 0
                      ? PROJECT_ENGAGMENT.PART_TIME
                      : PROJECT_ENGAGMENT.AVAILABLE,
              },
            });
          }
        }),
      );

      return tx.project.findUnique({
        where: {
          id: dto.projectId,
        },
      });
    });
  }

  public async delete(id: string): Promise<Project> {
    return await this.prismaService
      .$transaction(async (tx) => {
        const project = await tx.project.delete({
          where: { id },
          include: {
            employeeOnProject: {
              include: {
                employee: true,
              },
            },
          },
        });

        await Promise.all(
          project.employeeOnProject.map(async (eop) => {
            await tx.employee.update({
              where: { id: eop.employeeId },
              data: {
                hoursPerWeek: { decrement: eop.hoursWorked },
                projectEngagement:
                  eop.hoursWorked <= eop.employee.hoursPerWeek
                    ? PROJECT_ENGAGMENT.AVAILABLE
                    : PROJECT_ENGAGMENT.PART_TIME,
              },
            });
          }),
        );

        return project;
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
