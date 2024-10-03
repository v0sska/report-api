import { SaleRepository } from './sale.repository';
import { Sale } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

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
}
