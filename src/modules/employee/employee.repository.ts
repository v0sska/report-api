import { BaseRepository } from '@/common/types/base-repository.type';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Employee } from '@prisma/client';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { PROJECT_ENGAGMENT } from '@/common/constants/project-engagment.contants';

import { ClassLoggerService } from '@/common/utils/loger.util';

@Injectable()
export class EmployeeRepository extends BaseRepository<
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  private readonly logger: ClassLoggerService;
  public constructor(private readonly prismaService: PrismaService) {
    super();
    this.logger = new ClassLoggerService(EmployeeRepository.name);
  }

  public async create(dto: CreateEmployeeDto): Promise<Employee> {
    return await this.prismaService.employee
      .create({
        data: dto,
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Employee[]> {
    return await this.prismaService.employee
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

  public async findById(id: string): Promise<Employee> {
    return await this.prismaService.employee
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

  public async findAvailableEmployees(): Promise<Employee[]> {
    return await this.prismaService.employee
      .findMany({
        where: {
          NOT: {
            projectEngagement: PROJECT_ENGAGMENT.FULL_TIME,
          },
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

  public async findByUserId(userId: string): Promise<Employee> {
    return await this.prismaService.employee
      .findUnique({
        where: {
          userId,
        },
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateEmployeeDto,
  ): Promise<Employee> {
    return await this.prismaService.employee
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

  public async delete(id: string): Promise<Employee> {
    return await this.prismaService.employee
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
