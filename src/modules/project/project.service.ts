import { ProjectRepository } from './project.repository';

import { Employee, Project, ProjectManager } from '@prisma/client';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EXCEPTION } from '@/common/constants/exception.constants';
import { AssignMembersDto } from './dtos/assign-members.dto';

@Injectable()
export class ProjectService {
  public constructor(private readonly projectRepository: ProjectRepository) {}

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
    const projects =
      await this.projectRepository.findProjectByEmployeeId(employeeId);

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

  public async delete(id: string): Promise<Project> {
    const project = await this.projectRepository.delete(id);

    if (!project) {
      throw new NotFoundException(EXCEPTION.PROJECT_NOT_FOUND);
    }

    return project;
  }
}
