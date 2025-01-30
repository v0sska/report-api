export const REPORT_STATUS = {
  REJECTRED: 'Rejected',
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
} as const;

export type ReportStatusKeys = keyof typeof REPORT_STATUS;
export type ReportStatusValues = (typeof REPORT_STATUS)[ReportStatusKeys];
