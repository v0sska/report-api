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
import { ProjectService } from './project.service';
import {
  Employee,
  EmployeeOnProject,
  Project,
  ProjectManager,
  ProjectManagerOnProject,
} from '@prisma/client';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AssignEmployeeDto } from './dtos/assign-employee.dto';
import { AssignProjectManagerDto } from './dtos/assign-project-manager.dto';

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
      message: 'Project created successfully',
      data: project,
      status: HttpStatus.CREATED,
    };
  }

  @Get()
  public async find(): Promise<DataResponse<Project[]>> {
    const project = await this.projectService.find();

    return {
      message: 'Project fetched successfully',
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Post('assgin/employee')
  public async assignEmployeeToProject(
    @Body() dto: AssignEmployeeDto,
  ): Promise<DataResponse<EmployeeOnProject>> {
    const project = await this.projectService.assignEmployeeToProject(dto);

    return {
      message: 'Employee assigned to project successfully',
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Post('assign/project-manager')
  public async assignProjectManagerToProject(
    @Body() dto: AssignProjectManagerDto,
  ): Promise<DataResponse<ProjectManagerOnProject>> {
    const project =
      await this.projectService.assignProjectManagerToProject(dto);

    return {
      message: 'Project Manager assigned to project successfully',
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
      message: 'Employees fetched successfully',
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
      message: 'Project Manager fetched successfully',
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
      message: 'Projects fetched successfully',
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
      message: 'Projects fetched successfully',
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
      message: 'Project fetched successfully',
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
      message: 'Project updated successfully',
      data: project,
      status: HttpStatus.OK,
    };
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DataResponse<Project>> {
    const project = await this.projectService.delete(id);

    return {
      message: 'Project deleted successfully',
      data: project,
      status: HttpStatus.OK,
    };
  }
}
