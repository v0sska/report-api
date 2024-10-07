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
import { Sale } from '@prisma/client';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

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
}