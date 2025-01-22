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

import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ProjectManagerService } from './project-manager.service';

import { CreateProjectManagerDto } from './dtos/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dtos/update-project-manager.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ProjectManager } from '@prisma/client';

import { AuthGuard } from '@/common/guards/auth.guard';

import { MESSAGES } from '@/common/constants/messages.contants';

@Controller('project-manager')
@ApiTags('project-manager')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ProjectManagerController {
  public constructor(
    private readonly projectManagerService: ProjectManagerService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateProjectManagerDto,
  ): Promise<DataResponse<ProjectManager>> {
    const projectManager = await this.projectManagerService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: projectManager,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<ProjectManager[]>> {
    const projectManagers = await this.projectManagerService.find();

    return {
      message: MESSAGES.FETCHED,
      data: projectManagers,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectManager>> {
    const projectManager = await this.projectManagerService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: projectManager,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updates: UpdateProjectManagerDto,
  ): Promise<DataResponse<ProjectManager>> {
    const projectManager = await this.projectManagerService.update(id, updates);

    return {
      message: MESSAGES.UPDATED,
      data: projectManager,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<ProjectManager>> {
    const projectManager = await this.projectManagerService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: projectManager,
      status: HttpStatus.OK,
    };
  }
}
