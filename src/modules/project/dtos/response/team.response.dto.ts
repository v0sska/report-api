import { Employee, ProjectManager, Sales } from '@prisma/client';

export class TeamResponseDto {
  public name: string;
  public sales: Sales;
  public projectManager: ProjectManager;
  public employees: Employee[];
}
