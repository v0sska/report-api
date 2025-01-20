export const ROLE = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
  SDO: 'SalesDepartmentOfficer',
  PMDO: 'PMDepartmentOfficer',
  SALES: 'Sales',
  QA: 'QA',
  SUPER_ADMIN: 'SuperAdmin',
  PROJECT_MANAGER: 'ProjectManager',
} as const;

export type RoleKeys = keyof typeof ROLE;
export type RoleValues = (typeof ROLE)[RoleKeys];
