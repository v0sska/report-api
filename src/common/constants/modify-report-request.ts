export const MODIFY_REPORT_REQUEST = {
  EDIT: 'Edit',
  DELETE: 'Delete',
};

export type ModifyReportRequestKeys = keyof typeof MODIFY_REPORT_REQUEST;
export type ModifyReportRequestValues =
  (typeof MODIFY_REPORT_REQUEST)[ModifyReportRequestKeys];
