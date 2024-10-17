import { DevelopersOnCustomersRepository } from './developers-on-customers.repository';
import { DevelopersOnCustomers } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';
import { UpdateDevelopersOnCustomersDto } from './dtos/update-developers-on-customers.dto';

@Injectable()
export class DevelopersOnCustomersService {
	public constructor(private readonly developersoncustomersRepository: DevelopersOnCustomersRepository) {}

	public async find(): Promise<DevelopersOnCustomers[]> {
		return await this.developersoncustomersRepository.find();
	}

	public async findByDeveloperId(developerId: string): Promise<DevelopersOnCustomers[]> {
		const developersoncustomers = await this.developersoncustomersRepository.findByDeveloperId(developerId);

		if (!developersoncustomers) {
			throw new NotFoundException(EXCEPTION.DEVELOPERS_ON_CUSTOMERS_NOT_FOUND);
		}

		return developersoncustomers;
	}

	public async findByCustomerId(customerId: string): Promise<DevelopersOnCustomers[]> {
		const developersoncustomers = await this.developersoncustomersRepository.findByCustomerId(customerId);

		if (!developersoncustomers) {
			throw new NotFoundException(EXCEPTION.DEVELOPERS_ON_CUSTOMERS_NOT_FOUND);
		}

		return developersoncustomers;
	}

	public async updateAssignCustomer(customerId: string, developerId: string, updates: UpdateDevelopersOnCustomersDto): Promise<DevelopersOnCustomers> {
		const developersoncustomers = await this.developersoncustomersRepository.updateAssignCustomer(customerId, developerId, updates);

		if (!developersoncustomers) {
			throw new NotFoundException(EXCEPTION.DEVELOPERS_ON_CUSTOMERS_NOT_FOUND);
		}

		return developersoncustomers;
	}
}
