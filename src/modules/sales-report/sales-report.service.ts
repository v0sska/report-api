import { SalesReportRepository } from './sales-report.repository';
import { SalesReport } from '@prisma/client';
import { SalesService } from '../sales/sales.service';

import { CreateSalesReportDto } from './dtos/create-sales-report.dto';
import { UpdateSalesReportDto } from './dtos/update-sales-report.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { ROLE } from '@/common/constants/role.constants';

@Injectable()
export class SalesReportService {
  public constructor(
    private readonly salesReportRepository: SalesReportRepository,
    private readonly salesService: SalesService,
  ) {}

  public async create(
    userId: string,
    dto: CreateSalesReportDto,
  ): Promise<SalesReport> {
    const sales = await this.salesService.findByUserId(userId);
    return await this.salesReportRepository.create({
      ...dto,
      salesId: sales.id,
    });
  }

  public async find(userId: string, role: string): Promise<SalesReport[]> {
    switch (role) {
      case ROLE.ADMIN:
      case ROLE.SUPER_ADMIN:
      case ROLE.SDO:
        return await this.salesReportRepository.find();
      case ROLE.SALES:
        const sales = await this.salesService.findByUserId(userId);
        return await this.salesReportRepository.findBySalesId(sales.id);
      default:
        throw new BadRequestException(EXCEPTION.PERMISSION_DENIED);
    }
  }

  public async findById(id: string): Promise<SalesReport> {
    const salesreport = await this.salesReportRepository.findById(id);

    if (!salesreport) {
      throw new NotFoundException(EXCEPTION.SALESREPORT_NOT_FOUND);
    }

    return salesreport;
  }

  public async findBySalesId(salesId: string): Promise<SalesReport[]> {
    return await this.salesReportRepository.findBySalesId(salesId);
  }

  public async update(
    id: string,
    updates: UpdateSalesReportDto,
  ): Promise<SalesReport> {
    const salesreport = await this.salesReportRepository.update(id, updates);

    if (!salesreport) {
      throw new NotFoundException(EXCEPTION.SALESREPORT_NOT_FOUND);
    }

    return salesreport;
  }

  public async delete(id: string): Promise<SalesReport> {
    const salesreport = await this.salesReportRepository.delete(id);

    if (!salesreport) {
      throw new NotFoundException(EXCEPTION.SALESREPORT_NOT_FOUND);
    }

    return salesreport;
  }
}
