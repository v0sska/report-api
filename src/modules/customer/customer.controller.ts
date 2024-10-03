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
import { CustomerService } from './customer.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('customers')
@Controller('customers')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CustomerController {
  public constructor(private readonly customerService: CustomerService) {}

  @Post('/')
  public async create(
    @Body() dto: CreateCustomerDto,
  ): Promise<DataResponse<Customer>> {
    const customer = await this.customerService.create(dto);

    return {
      message: 'Customer created successfully',
      data: customer,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Customer[]>> {
    const customer = await this.customerService.find();

    return {
      message: 'Customer fetched successfully',
      data: customer,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Customer>> {
    const customer = await this.customerService.findById(id);

    return {
      message: 'Customer fetched successfully',
      data: customer,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<DataResponse<Customer>> {
    const customer = await this.customerService.update(id, dto);

    return {
      message: 'Customer updated successfully',
      data: customer,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<Customer>> {
    const customer = await this.customerService.delete(id);

    return {
      message: 'Customer deleted successfully',
      data: customer,
      status: HttpStatus.OK,
    };
  }
}
