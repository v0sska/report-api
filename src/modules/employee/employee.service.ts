import { BadRequestException, Injectable } from '@nestjs/common';

import { EmployeeRepository } from './employee.repository';

import { Employee } from '@prisma/client';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class EmployeeService {
  public constructor(private readonly employeeRepository: EmployeeRepository) {}

  public async create(dto: CreateEmployeeDto): Promise<Employee> {
    return await this.employeeRepository.create(dto);
  }

  public async find(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  public async findById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new BadRequestException(EXCEPTION.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  public async findAvailableEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAvailableEmployees();
  }

  public async findByUserId(userId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByUserId(userId);

    if (!employee) {
      throw new BadRequestException(EXCEPTION.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  public async update(
    id: string,
    updates: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.update(id, updates);

    if (!employee) {
      throw new BadRequestException(EXCEPTION.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  public async delete(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.delete(id);

    if (!employee) {
      throw new BadRequestException(EXCEPTION.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }
}
