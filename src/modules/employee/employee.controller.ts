import { Body, Controller, HttpStatus, Patch, Post, Get, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { Employee } from '@prisma/client';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Controller('employee')
@ApiTags('employee')
export class EmployeeController {
  public constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  public async create(
    @Body() dto: CreateEmployeeDto,
  ): Promise<DataResponse<Employee>> {
    const employee = await this.employeeService.create(dto);

    return {
      message: 'Employee created successfully',
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
      message: 'Employee retrieved successfully',
      data: employee,
      status: HttpStatus.OK,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<Employee[]>> {
    const employees = await this.employeeService.find();

    return {
      message: 'Employees retrieved successfully',
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
      message: 'Employee updated successfully',
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
      message: 'Employee removed successfully',
      data: employee,
      status: HttpStatus.OK,
    };
  }
}
