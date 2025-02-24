import { ProjectRepository } from './project.repository';

import { Employee, Project, ProjectManager } from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { TeamResponseDto } from './dtos/response/team.response.dto';
import { AssignMembersDto } from './dtos/assign-members.dto';
import { UpdateEmployeeHoursDto } from './dtos/update-employee-hours.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';

import { EmployeeService } from '../employee/employee.service';
import { SalesService } from '../sales/sales.service';
import { ProjectManagerService } from '../project-manager/project-manager.service';
import { UserService } from '../user/user.service';
import { ROLE } from '@/common/constants/role.constants';

@Injectable()
export class ProjectService {
  public constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly employeeService: EmployeeService,
    private readonly salesService: SalesService,
    private readonly projectManagerService: ProjectManagerService,
    private readonly userService: UserService,
  ) {}

  public async create(dto: CreateProjectDto): Promise<Project> {
    return await this.projectRepository.create(dto);
  }

  public async find(userId: string): Promise<Object[]> {
    return await this.projectRepository.find(userId);
  }

  public async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return project;
  }

  public async findMembersByProjectId(
    projectId: string,
  ): Promise<TeamResponseDto> {
    const team = await this.projectRepository.findMembersByProjectId(projectId);

    if (!team) {
      throw new BadRequestException(EXCEPTION.TEAM_NOT_FOUND);
    }

    return team;
  }

  public async findByUserId(userId: string): Promise<Project[] | Object[]> {
    const user = await this.userService.findById(userId);
    switch (user.role) {
      case ROLE.EMPLOYEE:
        const employee = await this.employeeService.findByUserId(userId);
        return await this.projectRepository.findProjectByEmployeeId(
          employee.id,
        );
      case ROLE.SALES:
        const sales = await this.salesService.findByUserId(userId);
        return await this.projectRepository.findProjectBySalesId(sales.id);
      case ROLE.PROJECT_MANAGER:
        const projectManager =
          await this.projectManagerService.findByUserId(userId);
        return await this.projectRepository.findProjectByProjectManagerId(
          projectManager.id,
        );
      default:
        return await this.projectRepository.find(userId);
    }
  }

  public async removeMembersFromProject(
    projectId: string,
    employeeId: string,
  ): Promise<Project> {
    const data = await this.projectRepository.removeMembersFromProject(
      projectId,
      employeeId,
    );

    if (!data) {
      throw new BadRequestException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return data;
  }

  public async assignMembersToProject(dto: AssignMembersDto): Promise<Project> {
    const data = await this.projectRepository.assignMembersToProject(dto);

    if (!data) {
      throw new BadRequestException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return data;
  }

  public async findProjectManagersByProjectId(
    projectId: string,
  ): Promise<ProjectManager> {
    const projectManager =
      await this.projectRepository.findProjectManagerByProjectId(projectId);

    if (!projectManager) {
      throw new BadRequestException(EXCEPTION.PROJECT_MANAGER_NOT_FOUND);
    }

    return projectManager;
  }

  public async findEmployeesByProjectId(
    projectId: string,
  ): Promise<Employee[]> {
    const employees =
      await this.projectRepository.findEmployeesByProjectId(projectId);

    if (!employees) {
      throw new BadRequestException(EXCEPTION.EMPLOYEE_NOT_FOUND);
    }

    return employees;
  }

  public async findProjectByEmployeeId(employeeId: string): Promise<Project[]> {
    const employee = await this.employeeService.findByUserId(employeeId);

    const projects = await this.projectRepository.findProjectByEmployeeId(
      employee.id,
    );

    if (!projects) {
      throw new BadRequestException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return projects;
  }

  public async findProjectByProjectManagerId(
    projectManagerId: string,
  ): Promise<Project[]> {
    const projects =
      await this.projectRepository.findProjectByProjectManagerId(
        projectManagerId,
      );

    if (!projects) {
      throw new BadRequestException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return projects;
  }

  public async update(id: string, updates: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.update(id, updates);

    if (!project) {
      throw new NotFoundException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return project;
  }

  public async updateEmployeeHours(
    dto: UpdateEmployeeHoursDto,
  ): Promise<Project> {
    const project = await this.projectRepository.updateEmployeeHours(dto);

    if (!project) {
      throw new NotFoundException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return project;
  }

  public async delete(id: string): Promise<Project> {
    const project = await this.projectRepository.delete(id);

    if (!project) {
      throw new NotFoundException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return project;
  }
}
