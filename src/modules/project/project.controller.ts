import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';

import { Employee, Project, ProjectManager } from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AssignMembersDto } from './dtos/assign-members.dto';
import { TeamResponseDto } from './dtos/response/team.response.dto';

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

  @Post('assign')
  public async assignMembersToProject(
    @Body() dto: AssignMembersDto,
  ): Promise<DataResponse<Project>> {
    const project = await this.projectService.assignMembersToProject(dto);

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

  @Get('members/:projectId')
  public async findMembersByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<DataResponse<TeamResponseDto>> {
    const employees =
      await this.projectService.findMembersByProjectId(projectId);

    return {
      message: MESSAGES.FETCHED,
      data: employees,
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

  @Delete('assign/remove')
  public async removeMembersFromProject(
    @Query('project-id') projectId: string,
    @Query('employee-id') employeeId: string,
  ): Promise<DataResponse<Project>> {
    const project = await this.projectService.removeMembersFromProject(
      projectId,
      employeeId,
    );

    return {
      message: MESSAGES.DELETED,
      data: project,
      status: HttpStatus.OK,
    };
  }
}
