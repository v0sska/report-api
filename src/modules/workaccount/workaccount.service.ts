import { WorkAccountRepository } from './workaccount.repository';
import { WorkAccount } from '@prisma/client';
import { CreateWorkAccountDto } from './dtos/create-workaccount.dto';
import { UpdateWorkAccountDto } from './dtos/update-workaccount.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class WorkAccountService {
  public constructor(
    private readonly workaccountRepository: WorkAccountRepository,
  ) {}

  public async create(dto: CreateWorkAccountDto): Promise<WorkAccount> {
    return await this.workaccountRepository.create(dto);
  }

  public async find(): Promise<WorkAccount[]> {
    return await this.workaccountRepository.find();
  }

  public async findById(id: string): Promise<WorkAccount> {
    const workaccount = await this.workaccountRepository.findById(id);

    if (!workaccount) {
      throw new NotFoundException(EXCEPTION.WORKACCOUNT_NOT_FOUND);
    }

    return workaccount;
  }

  public async update(
    id: string,
    updates: UpdateWorkAccountDto,
  ): Promise<WorkAccount> {
    const workaccount = await this.workaccountRepository.update(id, updates);

    if (!workaccount) {
      throw new NotFoundException(EXCEPTION.WORKACCOUNT_NOT_FOUND);
    }

    return workaccount;
  }

  public async delete(id: string): Promise<WorkAccount> {
    const workaccount = await this.workaccountRepository.delete(id);

    if (!workaccount) {
      throw new NotFoundException(EXCEPTION.WORKACCOUNT_NOT_FOUND);
    }

    return workaccount;
  }
}
