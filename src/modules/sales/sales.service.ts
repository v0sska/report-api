import { SalesRepository } from './sales.repository';

import { Sales } from '@prisma/client';

import { CreateSalesDto } from './dtos/create-sales.dto';
import { UpdateSalesDto } from './dtos/update-sales.dto';
import { SalesStatiscticResponseDto } from './dtos/reponse/sale-statistic-response.dto';

import { Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class SalesService {
  public constructor(private readonly saleRepository: SalesRepository) {}

  public async create(dto: CreateSalesDto): Promise<Sales> {
    return await this.saleRepository.create(dto);
  }

  public async find(): Promise<Sales[]> {
    return await this.saleRepository.find();
  }

  public async findById(id: string): Promise<Sales> {
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async findByUserId(userId: string): Promise<Sales> {
    const sale = await this.saleRepository.findByUserId(userId);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async getSalesStatistic(): Promise<SalesStatiscticResponseDto> {
    return await this.saleRepository.getSalesStatistic();
  }

  public async update(id: string, updates: UpdateSalesDto): Promise<Sales> {
    const sale = await this.saleRepository.update(id, updates);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }

  public async delete(id: string): Promise<Sales> {
    const sale = await this.saleRepository.delete(id);

    if (!sale) {
      throw new NotFoundException(EXCEPTION.SALE_NOT_FOUND);
    }

    return sale;
  }
}
