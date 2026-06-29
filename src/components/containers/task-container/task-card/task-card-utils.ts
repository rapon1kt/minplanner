const severityTextColor = {
  low: "text-green-800",
  medium: "text-amber-800",
  high: "text-red-800",
} as const;

export type SeverityType = keyof typeof severityTextColor;

export const DELETE_TASK_CONFIRMATION_PREFERENCE_KEY =
  "minplanner:show-delete-task-confirmation";

export const capitalizeStr = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getSeverityTextColor = (severity: SeverityType) => {
  return severityTextColor[severity];
};

export const isSeverityType = (
  severity: string | undefined,
): severity is SeverityType => {
  return typeof severity === "string" && severity in severityTextColor;
};

export const renewTaskToToday = (): string => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toString();
};
