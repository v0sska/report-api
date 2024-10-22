import { BaseRepository } from '@/common/types/base-repository.type';
import { Sale, DevelopersOnCustomers, Income } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDevelopersOnCustomersDto } from '../developers-on-customers/dtos/create-developers-on-customers.dto';

@Injectable()
export class SaleRepository extends BaseRepository<
  Sale,
  CreateSaleDto,
  UpdateSaleDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateSaleDto): Promise<Sale> {
    return await this.prismaService.sale
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async find(): Promise<Sale[]> {
    return await this.prismaService.sale.findMany().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findById(id: string): Promise<Sale> {
    return await this.prismaService.sale
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(id: string, updates: UpdateSaleDto): Promise<Sale> {
    return await this.prismaService.sale
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

  public async delete(id: string): Promise<Sale> {
    return await this.prismaService.sale
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async assignDeveloperToCustomer(dto: CreateDevelopersOnCustomersDto): Promise<DevelopersOnCustomers> {
	return await this.prismaService.developersOnCustomers
	  .create({
		data: dto,
	  })
	  .catch((error) => {
		throw new InternalServerErrorException(error.message);
	  });
  }

  public async updateIncomeById(id: string, isPay: boolean): Promise<Income> {
	return await this.prismaService.income
	.update({
		where: {
			id: id,
		},
		data: {
			isPay: isPay,
		}
	})
	.catch((error) => {
		throw new InternalServerErrorException(error.message);
	});
  }

}
