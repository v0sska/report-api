export const PROJECT_ENGAGMENT = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  AVAILABLE: 'Available',
} as const;

export type ProjectEngagmentKeys = keyof typeof PROJECT_ENGAGMENT;
export type ProjectEngagmentValues =
  (typeof PROJECT_ENGAGMENT)[ProjectEngagmentKeys];
