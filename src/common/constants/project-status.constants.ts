export const PROJECT_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
} as const;

export type ProjectStatusKeys = keyof typeof PROJECT_STATUS;
export type ProjectStatusValues = (typeof PROJECT_STATUS)[ProjectStatusKeys];
