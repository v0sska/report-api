import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';

import {
  Employee,
  EmployeeOnProject,
  Project,
  ProjectManager,
} from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AssignEmployeeDto } from './dtos/assign-employee.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/common/guards/auth.guard';

import { MESSAGES } from '@/common/constants/messages.contants';

import { Request } from 'express';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

  @Post()
  public async create(
    @Body() dto: CreateProjectDto,
  ): Promise<DataResponse<Project>> {
    const project = await this.projectService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: project,
      status: HttpStatus.CREATED,
    };
  }

  @Post('assgin/employee')
  public async assignEmployeeToProject(
    @Body() dto: AssignEmployeeDto,
  ): Promise<DataResponse<EmployeeOnProject>> {
    const project = await this.projectService.assignEmployeeToProject(dto);

    return {
      message: MESSAGES.ASSIGNED,
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Get()
  public async find(@Req() request: Request): Promise<DataResponse<Object[]>> {
    const { id } = request['user'];

    const project = await this.projectService.find(id);

    return {
      message: MESSAGES.FETCHED,
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Get('employees/:projectId')
  public async findEmployeesByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<DataResponse<Employee[]>> {
    const employees =
      await this.projectService.findEmployeesByProjectId(projectId);

    return {
      message: MESSAGES.FETCHED,
      data: employees,
      status: HttpStatus.OK,
    };
  }

  @Get('project-managers/:projectId')
  public async findProjectManagersByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<DataResponse<ProjectManager>> {
    const projectManager =
      await this.projectService.findProjectManagersByProjectId(projectId);

    return {
      message: MESSAGES.FETCHED,
      data: projectManager,
      status: HttpStatus.OK,
    };
  }

  @Get('employee/:employeeId')
  public async findProjectsByEmployeeId(
    @Param('employeeId') employeeId: string,
  ): Promise<DataResponse<Project[]>> {
    const projects =
      await this.projectService.findProjectByEmployeeId(employeeId);

    return {
      message: MESSAGES.FETCHED,
      data: projects,
      status: HttpStatus.OK,
    };
  }

  @Get('project-manager/:projectManagerId')
  public async findProjectsByProjectManagerId(
    @Param('projectManagerId') projectManagerId: string,
  ): Promise<DataResponse<Project[]>> {
    const projects =
      await this.projectService.findProjectByProjectManagerId(projectManagerId);

    return {
      message: MESSAGES.FETCHED,
      data: projects,
      status: HttpStatus.OK,
    };
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Project>> {
    const project = await this.projectService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<DataResponse<Project>> {
    const project = await this.projectService.update(id, dto);

    return {
      message: MESSAGES.UPDATED,
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DataResponse<Project>> {
    const project = await this.projectService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: project,
      status: HttpStatus.OK,
    };
  }
}
