import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SalesReportService } from './sales-report.service';

import { SalesReport } from '@prisma/client';

import { CreateSalesReportDto } from './dtos/create-sales-report.dto';
import { UpdateSalesReportDto } from './dtos/update-sales-report.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '@/common/constants/messages.contants';

import { Request } from 'express';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('sales-reports')
@Controller('sales-reports')
@UseGuards(AuthGuard)
export class SalesReportController {
  public constructor(private readonly salesReportService: SalesReportService) {}

  @Post()
  public async create(
    @Body() dto: CreateSalesReportDto,
    @Req() request: Request,
  ): Promise<DataResponse<SalesReport>> {
    const { id } = request['user'];

    const salesReport = await this.salesReportService.create(id, dto);

    return {
      message: MESSAGES.CREATED,
      data: salesReport,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(
    @Req() request: Request,
  ): Promise<DataResponse<SalesReport[]>> {
    const { id, role } = request['user'];

    const salesReport = await this.salesReportService.find(id, role);

    return {
      message: MESSAGES.FETCHED,
      data: salesReport,
      status: HttpStatus.OK,
    };
  }

  @Get('sales/:salesId')
  public async findBySalesId(
    @Param('salesId') salesId: string,
  ): Promise<DataResponse<SalesReport[]>> {
    const salesReport = await this.salesReportService.findBySalesId(salesId);

    return {
      message: MESSAGES.FETCHED,
      data: salesReport,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<SalesReport>> {
    const salesReport = await this.salesReportService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: salesReport,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateSalesReportDto,
  ): Promise<DataResponse<SalesReport>> {
    const salesReport = await this.salesReportService.update(id, dto);

    return {
      message: MESSAGES.UPDATED,
      data: salesReport,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<SalesReport>> {
    const salesReport = await this.salesReportService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: salesReport,
      status: HttpStatus.OK,
    };
  }
}
