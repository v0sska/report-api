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
import { SalesService } from './sales.service';
import { Sales } from '@prisma/client';
import { CreateSalesDto } from './dtos/create-sales.dto';
import { UpdateSalesDto } from './dtos/update-sales.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('sales')
@Controller('sales')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class SaleController {
  public constructor(private readonly saleService: SalesService) {}

  @Post('/')
  public async create(
    @Body() dto: CreateSalesDto,
  ): Promise<DataResponse<Sales>> {
    const sale = await this.saleService.create(dto);

    return {
      message: 'Sale created successfully',
      data: sale,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Sales[]>> {
    const sale = await this.saleService.find();

    return {
      message: 'Sale fetched successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<DataResponse<Sales>> {
    const sale = await this.saleService.findById(id);

    return {
      message: 'Sale fetched successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Get('user/:userId')
  public async findByUserId(
    @Param('userId') userId: string,
  ): Promise<DataResponse<Sales>> {
    const sale = await this.saleService.findByUserId(userId);

    return {
      message: 'Sale fetched successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateSalesDto,
  ): Promise<DataResponse<Sales>> {
    const sale = await this.saleService.update(id, dto);

    return {
      message: 'Sale updated successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DataResponse<Sales>> {
    const sale = await this.saleService.delete(id);

    return {
      message: 'Sale deleted successfully',
      data: sale,
      status: HttpStatus.OK,
    };
  }
}
