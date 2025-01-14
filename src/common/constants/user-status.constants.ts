export const USER_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
} as const;

export type StatusKeys = keyof typeof USER_STATUS;
export type StatusValues = (typeof USER_STATUS)[StatusKeys];
