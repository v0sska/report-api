import { BaseRepository } from '@/common/types/base-repository.type';

import { PrismaService } from '@/database/prisma.service';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Employee } from '@prisma/client';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Injectable()
export class EmployeeRepository extends BaseRepository<
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateEmployeeDto): Promise<Employee> {
    return await this.prismaService.employee
      .create({
        data: dto,
      })
      .catch((error) => {
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
        throw new InternalServerErrorException(error.message);
      });
  }
}
