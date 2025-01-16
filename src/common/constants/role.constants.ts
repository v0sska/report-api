export const ROLE = {
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
  SDO: 'SalesDepartmentOfficer',
  PMDO: 'PMDepartmentOfficer',
  SALE: 'Sale',
  QA: 'QA',
  SUPER_ADMIN: 'SuperAdmin',
  PROJECT_MANAGER: 'ProjectManager',
} as const;

export type RoleKeys = keyof typeof ROLE;
export type RoleValues = (typeof ROLE)[RoleKeys];
