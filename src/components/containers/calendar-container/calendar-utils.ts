import type { Task } from "@/core/domain/models";

export type CalendarDay = {
  date: Date;
  dayNumber: number;
  isSelected: boolean;
  isToday: boolean;
  key: string;
  tasks: Task[];
};

export type CalendarStats = {
  completed: number;
  overdue: number;
  pending: number;
  scheduled: number;
  unscheduled: number;
};

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTaskDueDateKey(dueDate?: string) {
  if (!dueDate) return undefined;

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getFullDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    weekday: "long",
  }).format(date);
}

export function getShortDateLabel(dueDate?: string) {
  if (!dueDate) return "No due date";

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function createTaskDateMap(tasks: Task[]) {
  const taskDateMap = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const dateKey = getTaskDueDateKey(task.dueDate);

    if (!dateKey) return;

    taskDateMap.set(dateKey, [...(taskDateMap.get(dateKey) ?? []), task]);
  });

  return taskDateMap;
}

export function getCalendarDays(
  currentMonth: Date,
  tasks: Task[],
  selectedDate: Date | null,
) {
  const taskDateMap = createTaskDateMap(tasks);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const todayKey = getDateKey(new Date());
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : "";
  const calendarDays: Array<CalendarDay | null> = [];

  for (let index = 0; index < firstDayOfMonth; index += 1) {
    calendarDays.push(null);
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    const date = new Date(year, month, dayNumber);
    const key = getDateKey(date);

    calendarDays.push({
      date,
      dayNumber,
      isSelected: key === selectedDateKey,
      isToday: key === todayKey,
      key,
      tasks: taskDateMap.get(key) ?? [],
    });
  }

  return calendarDays;
}

export function getTasksForDate(tasks: Task[], date: Date | null) {
  if (!date) return [];

  const selectedDateKey = getDateKey(date);

  return tasks.filter(
    (task) => getTaskDueDateKey(task.dueDate) === selectedDateKey,
  );
}

export function getTasksForMonth(tasks: Task[], currentMonth: Date) {
  const monthKey = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1,
  ).padStart(2, "0")}`;

  return tasks.filter((task) =>
    getTaskDueDateKey(task.dueDate)?.startsWith(monthKey),
  );
}

export function getCalendarStats(
  tasks: Task[],
  currentMonth: Date,
): CalendarStats {
  const scheduledTasks = getTasksForMonth(tasks, currentMonth);

  return {
    completed: scheduledTasks.filter((task) => task.isCompleted).length,
    overdue: scheduledTasks.filter((task) => task.isExpired).length,
    pending: scheduledTasks.filter(
      (task) => !task.isCompleted && !task.isExpired,
    ).length,
    scheduled: scheduledTasks.length,
    unscheduled: tasks.filter((task) => !task.dueDate).length,
  };
}
