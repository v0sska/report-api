export class StatisticResponseDto {
  projectId: string;
  projectName: string;
  clientName: string;
  totalAmount: number;
  totalHours: number;
  totalIncomeAccepted: number;
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
