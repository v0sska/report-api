export class EmployeeReportResponse {
  id: string;
  employeeId: string;
  projectId: string;
  hoursWorked: string;
  startTime: string;
  endTime: string;
  date: Date;
  text: string;
  editStatus: string;
  deleteStatus: string;
  updatedAt: Date;
  createdAt: Date;
  project: {
    name: string;
  };
  employee: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
