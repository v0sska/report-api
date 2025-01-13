import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { DevelopersOnCustomers, Income, Sale } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CreateDevelopersOnCustomersDto } from '../developers-on-customers/dtos/create-developers-on-customers.dto';

@ApiTags('sales')
@Controller('sales')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SaleController {
  public constructor(private readonly saleService: SaleService) {}

  @Post('/')
  public async create(@Body() dto: CreateSaleDto): Promise<DataResponse<Sale>> {
    const sale = await this.saleService.create(dto);

    return {
      message: 'Sale created successfully',
      data: sale,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Sale[]>> {
    const sale = await this.saleService.find();

    return {
      message: 'Sale fetched successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<DataResponse<Sale>> {
    const sale = await this.saleService.findById(id);

    return {
      message: 'Sale fetched successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleDto,
  ): Promise<DataResponse<Sale>> {
    const sale = await this.saleService.update(id, dto);

    return {
      message: 'Sale updated successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DataResponse<Sale>> {
    const sale = await this.saleService.delete(id);

    return {
      message: 'Sale deleted successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Post('assign-developer')
  public async assignDeveloperToCustomer(
    @Body() dto: CreateDevelopersOnCustomersDto,
  ): Promise<DataResponse<DevelopersOnCustomers>> {
    const developersOnCustomers =
      await this.saleService.assignDeveloperToCustomer(dto);

    return {
      message: 'Developer assigned to customer successfully',
      data: developersOnCustomers,
      status: HttpStatus.CREATED,
    };
  }

  @Patch('/income/:id')
  public async updateIncome(
    @Param('id') id: string,
    @Body() body: { isPay: boolean },
  ): Promise<DataResponse<Income>> {
    const income = await this.saleService.updateIncome(id, body.isPay);

    return {
      message: 'Income updated successfully',
      data: income,
      status: HttpStatus.OK,
    };
  }
}
