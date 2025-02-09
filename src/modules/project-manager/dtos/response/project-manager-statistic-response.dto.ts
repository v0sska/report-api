export class ProjectManagerStatisticResponseDto {
  projectManagers: Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    projectCount: number;
  }>;
}
