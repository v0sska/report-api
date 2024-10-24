import { SaleRepository } from './sale.repository';
import { DevelopersOnCustomers, Income, Sale } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';
import { CreateDevelopersOnCustomersDto } from '../developers-on-customers/dtos/create-developers-on-customers.dto';

@Injectable()
export class SaleService {
  public constructor(private readonly saleRepository: SaleRepository) {}

  public async create(dto: CreateSaleDto): Promise<Sale> {
    dto.timeJoin = new Date(dto.timeJoin);
    return await this.saleRepository.create(dto);
  }

  public async find(): Promise<Sale[]> {
    return await this.saleRepository.find();
  }

  public async findById(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async update(id: string, updates: UpdateSaleDto): Promise<Sale> {
    if (updates.timeJoin) {
      updates.timeJoin = new Date(updates.timeJoin);
    }

    const sale = await this.saleRepository.update(id, updates);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async delete(id: string): Promise<Sale> {
    const sale = await this.saleRepository.delete(id);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async assignDeveloperToCustomer(dto: CreateDevelopersOnCustomersDto): Promise<DevelopersOnCustomers> {
	return await this.saleRepository.assignDeveloperToCustomer(dto);
  }

  public async updateIncome(id: string, isPay: boolean): Promise<Income> {
	const income = await this.saleRepository.updateIncomeById(id, isPay);

	if (!income) {
	  throw new NotFoundException(EXCEPTION.INCOME_NOT_FOUND);
	}

	return income;
  }
}
