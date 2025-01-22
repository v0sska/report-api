import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { EmployeeService } from './employee.service';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { Employee } from '@prisma/client';

import { AuthGuard } from '@/common/guards/auth.guard';

import { MESSAGES } from '@/common/constants/messages.contants';

@Controller('employee')
@ApiTags('employee')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class EmployeeController {
  public constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  public async create(
    @Body() dto: CreateEmployeeDto,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: employee,
      status: HttpStatus.CREATED,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: employee,
      status: HttpStatus.OK,
    };
  }

  @Get('user/:userId')
  public async findByUserId(
    @Param('userId') userId: string,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.findByUserId(userId);

    return {
      message: MESSAGES.FETCHED,
      data: employee,
      status: HttpStatus.OK,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<Employee[]>> {
    const employees = await this.employeeService.find();

    return {
      message: MESSAGES.FETCHED,
      data: employees,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.update(id, dto);

    return {
      message: MESSAGES.UPDATED,
      data: employee,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: employee,
      status: HttpStatus.OK,
    };
  }
}
