import { BaseRepository } from '@/common/types/base-repository.type';
import { ProjectManager } from '@prisma/client';
import { CreateProjectManagerDto } from './dtos/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dtos/update-project-manager.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProjectManagerRepository extends BaseRepository<
  ProjectManager,
  CreateProjectManagerDto,
  UpdateProjectManagerDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateProjectManagerDto): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .create({
        data: dto,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
  public async find(): Promise<ProjectManager[]> {
    return await this.prismaService.projectManager
      .findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
  public async findById(id: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByUserId(userId: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .findUnique({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(
    id: string,
    updates: UpdateProjectManagerDto,
  ): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .update({
        where: {
          id,
        },
        data: updates,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async delete(id: string): Promise<ProjectManager> {
    return await this.prismaService.projectManager
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
