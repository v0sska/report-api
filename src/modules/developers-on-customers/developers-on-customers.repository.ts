import { BaseRepository } from '@/common/types/base-repository.type';
import { DevelopersOnCustomers } from '@prisma/client';
import { CreateDevelopersOnCustomersDto } from './dtos/create-developers-on-customers.dto';
import { UpdateDevelopersOnCustomersDto } from './dtos/update-developers-on-customers.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DevelopersOnCustomersRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async find(): Promise<DevelopersOnCustomers[]> {
    return await this.prismaService.developersOnCustomers
      .findMany()
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByDeveloperId(
    developerId: string,
  ): Promise<DevelopersOnCustomers[]> {
    return await this.prismaService.developersOnCustomers
      .findMany({
        where: {
          developerId: developerId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByCustomerId(
    customerId: string,
  ): Promise<DevelopersOnCustomers[]> {
    return await this.prismaService.developersOnCustomers
      .findMany({
        where: {
          customerId: customerId,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async updateAssignCustomer(
    customerId: string,
    developerId: string,
    updates: UpdateDevelopersOnCustomersDto,
  ): Promise<DevelopersOnCustomers> {
    return await this.prismaService.developersOnCustomers
      .update({
        where: {
          developerId_customerId: {
            developerId: developerId,
            customerId: customerId,
          },
        },
        data: updates,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
