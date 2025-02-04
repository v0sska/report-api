export const INCOME_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
};

export type IncomeStatusKeys = keyof typeof INCOME_STATUS;
export type IncomeStatusValues = (typeof INCOME_STATUS)[IncomeStatusKeys];
