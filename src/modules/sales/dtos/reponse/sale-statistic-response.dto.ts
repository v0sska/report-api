export class SalesStatiscticResponseDto {
  sales: Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    projectCount: number;
    projects: Array<{
      id: string;
      name: string;
      amount: number;
    }>;
    projectAmountSum: number;
  }>;
}
