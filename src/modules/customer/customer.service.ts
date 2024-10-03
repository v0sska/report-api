import { CustomerRepository } from './customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class CustomerService {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async create(dto: CreateCustomerDto): Promise<Customer> {
    return await this.customerRepository.create(dto);
  }

  public async find(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  public async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException(EXCEPTION.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }

  public async update(
    id: string,
    updates: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.update(id, updates);

    if (!customer) {
      throw new NotFoundException(EXCEPTION.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }

  public async delete(id: string): Promise<Customer> {
    const customer = await this.customerRepository.delete(id);

    if (!customer) {
      throw new NotFoundException(EXCEPTION.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }
}
