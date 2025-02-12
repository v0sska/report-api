export class StatisticResponseDto {
  projectId: string;
  projectName: string;
  clientName: string;
  totalAmount: string;
  totalHours: string;
  totalIncomeAccepted: string;
  employees: Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    rate: number;
    maxHours: number;
    incomes: Array<{
      id: string;
      reportId: string;
      date: Date;
      hours: number;
      amount: number;
      status: string;
    }>;
  }>;
}
