import { DeveloperRepository } from './developer.repository';
import { Developer } from '@prisma/client';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { UpdateDeveloperDto } from './dtos/update-developer.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class DeveloperService {
  public constructor(
    private readonly developerRepository: DeveloperRepository,
  ) {}

  public async create(dto: CreateDeveloperDto): Promise<Developer> {
    dto.timeJoin = new Date(dto.timeJoin);

    return await this.developerRepository.create(dto);
  }

  public async find(): Promise<Developer[]> {
    return await this.developerRepository.find();
  }

  public async findById(id: string): Promise<Developer> {
    const developer = await this.developerRepository.findById(id);

    if (!developer) {
      throw new NotFoundException(EXCEPTION.DEVELOPER_NOT_FOUND);
    }

    return developer;
  }

  public async update(
    id: string,
    updates: UpdateDeveloperDto,
  ): Promise<Developer> {
    if (updates.timeJoin) {
      updates.timeJoin = new Date(updates.timeJoin);
    }

    const developer = await this.developerRepository.update(id, updates);

    if (!developer) {
      throw new NotFoundException(EXCEPTION.DEVELOPER_NOT_FOUND);
    }

    return developer;
  }

  public async delete(id: string): Promise<Developer> {
    const developer = await this.developerRepository.delete(id);

    if (!developer) {
      throw new NotFoundException(EXCEPTION.DEVELOPER_NOT_FOUND);
    }

    return developer;
  }
}
