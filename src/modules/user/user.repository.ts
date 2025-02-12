import { BaseRepository } from '@/common/types/base-repository.type';

import { User } from '@prisma/client';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ROLE } from '@/common/constants/role.constants';

import { ClassLoggerService } from '@/common/utils/loger.util';

@Injectable()
export class UserRepository extends BaseRepository<
  User | object,
  CreateUserDto,
  UpdateUserDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(UserRepository.name);
  }

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.prismaService.user
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<User[]> {
    return await this.prismaService.user.findMany().catch((error) => {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(
    id: string,
  ): Promise<
    Omit<User, 'password' | 'inviteToken' | 'status' | 'salary'>
  > {
    return await this.prismaService.user
      .findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          position: true,
          dateOfBirth: true,
          firstDayInCompany: true,
          phone: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findMe(id: string): Promise<Object> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            role: true,
            password: false,
            salary: true,
            firstDayInCompany: true,
            phone: true,
            dateOfBirth: true,
          },
        });

        const getRoleAndProjects = async (
          roleTable: string,
          userId: string,
        ) => {
          const role = await tx[roleTable].findFirst({ where: { userId } });
          if (!role) return { role: null, projects: [] };

          let projects = [];
          switch (roleTable) {
            case ROLE.SALES:
              projects = await tx.project.findMany({
                where: { salesId: role.id },
              });
              break;
            case ROLE.EMPLOYEE:
              const employeeOnProjects = await tx.employeeOnProject.findMany({
                where: { employeeId: role.id },
              });
              const projectIds = employeeOnProjects.map((eop) => eop.projectId);
              projects = await tx.project.findMany({
                where: { id: { in: projectIds } },
                select: {
                  id: true,
                  name: true,
                  clientName: true,
                  hoursInWeek: true,
                  teamInfo: true,
                  status: true,
                  salesId: true,
                },
              });
              break;
            case ROLE.PROJECT_MANAGER:
              projects = await tx.project.findMany({
                where: { projectManagerId: role.id },
                select: {
                  id: true,
                  name: true,
                  clientName: true,
                  hoursInWeek: true,
                  teamInfo: true,
                  status: true,
                  salesId: true,
                },
              });
              break;
          }

          return { role, projects };
        };

        let roleData;
        switch (user.role) {
          case ROLE.SALES:
            roleData = await getRoleAndProjects(ROLE.SALES, user.id);
            break;
          case ROLE.EMPLOYEE:
            roleData = await getRoleAndProjects(ROLE.EMPLOYEE, user.id);
            break;
          case ROLE.PROJECT_MANAGER:
            roleData = await getRoleAndProjects(ROLE.PROJECT_MANAGER, user.id);
            break;
          default:
            roleData = { role: null, projects: [] };
        }

        return {
          user,
          role: roleData.role,
          projects: roleData.projects,
        };
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });

    return tx;
  }

  public async adminFindUserById(
    id: string,
    adminRole: string,
  ): Promise<Object> {
    const tx = await this.prismaService
      .$transaction(async (tx) => {
        const isAdmin =
          adminRole === ROLE.ADMIN || adminRole === ROLE.SUPER_ADMIN;

        const user = await tx.user.findUnique({
          where: { id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            role: true,
            password: false,
            salary: isAdmin ? true : false,
            firstDayInCompany: true,
            phone: true,
            dateOfBirth: true,
          },
        });

        const getRoleAndProjects = async (
          roleTable: string,
          userId: string,
        ) => {
          const role = await tx[roleTable].findFirst({ where: { userId } });
          if (!role) return { role: null, projects: [] };

          let projects = [];
          switch (roleTable) {
            case ROLE.SALES:
              projects = await tx.project.findMany({
                where: { salesId: role.id },
                select: {
                  id: true,
                  name: true,
                  clientName: true,
                  rate: isAdmin ? true : false,
                  hoursInWeek: true,
                  teamInfo: true,
                  status: true,
                  salesId: true,
                },
              });
              break;
            case ROLE.EMPLOYEE:
              const employeeOnProjects = await tx.employeeOnProject.findMany({
                where: { employeeId: role.id },
              });
              const projectIds = employeeOnProjects.map((eop) => eop.projectId);
              projects = await tx.project.findMany({
                where: { id: { in: projectIds } },
                select: {
                  id: true,
                  name: true,
                  clientName: true,
                  rate: isAdmin ? true : false,
                  hoursInWeek: true,
                  teamInfo: true,
                  status: true,
                  salesId: true,
                },
              });
              break;
            case ROLE.PROJECT_MANAGER:
              projects = await tx.project.findMany({
                where: { projectManagerId: role.id },
                select: {
                  id: true,
                  name: true,
                  clientName: true,
                  rate: isAdmin ? true : false,
                  hoursInWeek: true,
                  teamInfo: true,
                  status: true,
                  salesId: true,
                },
              });
              break;
          }

          return { role, projects };
        };

        let roleData;
        switch (user.role) {
          case ROLE.SALES:
            roleData = await getRoleAndProjects(ROLE.SALES, user.id);
            break;
          case ROLE.EMPLOYEE:
            roleData = await getRoleAndProjects(ROLE.EMPLOYEE, user.id);
            break;
          case ROLE.PROJECT_MANAGER:
            roleData = await getRoleAndProjects(ROLE.PROJECT_MANAGER, user.id);
            break;
          default:
            roleData = { role: null, projects: [] };
        }

        return {
          user,
          role: roleData.role,
          projects: roleData.projects,
        };
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });

    return tx;
  }

  public async findByEmail(email: string) {
    return await this.prismaService.user
      .findUnique({
        where: {
          email,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(id: string, updates: UpdateUserDto): Promise<User> {
    return await this.prismaService.user
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

  public async delete(id: string): Promise<User> {
    return await this.prismaService.user
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
